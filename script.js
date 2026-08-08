document.addEventListener('DOMContentLoaded', () => {
  // 0. Dark & Light Theme Switcher
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('theme') || 'dark';

  if (savedTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    if (themeToggle) {
      themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (themeToggle) {
      themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      if (isLight) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
      }
    });
  }

  // 1. Mobile Navigation Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });

    // Close menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-xmark');
        }
      });
    });
  }

  // 2. Navbar Background Scroll Effect & Active Scroll Spy
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll spy
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 100;
      const sectionId = current.getAttribute('id');
      const navLink = document.querySelector(`.nav-links a[href*=${sectionId}]`);

      if (navLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLink.classList.add('active');
        } else {
          navLink.classList.remove('active');
        }
      }
    });
  });

  // 3. Hero Dynamic Typing Text Effect
  const typingElement = document.getElementById('typingText');
  if (typingElement) {
    const phrases = [
      "Senior Embedded Firmware Engineer",
      "BLDC Motor Driver & Smart Appliance Developer",
      "Firmware & Secure FOTA Specialist",
      "TFT Touch Interface & ESP32-C3 Architect",
      "Automotive AIS-140 & VTS Telematics Engineer",
      "4S-16S Smart Battery Management System (BMS)"
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 90;

    function typeEffect() {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 40;
      } else {
        typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 80;
      }

      if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typingSpeed = 1800; // Pause at end
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingSpeed = 400; // Pause before typing next
      }

      setTimeout(typeEffect, typingSpeed);
    }

    typeEffect();
  }

  // 4. Interactive Firmware Terminal Snippet Tabs & Copy
  const snippets = {
    bldc_appliance: `// High-Efficiency BLDC Motor Driver & Smart Appliance Control (ESP32-C3 / ESP-IDF)
#include "esp_system.h"
#include "driver/mcpwm.h"
#include "driver/i2c.h"
#include "wt32_sc01_tft.h"

typedef struct {
    uint16_t bldc_rpm_target;
    uint16_t bldc_rpm_current;
    float    heater_temp_celsius;
    bool     chimney_boost_mode;
} Smart_Appliance_State_t;

Smart_Appliance_State_t g_chimney_state;

void BLDC_Motor_Speed_Control(uint16_t target_rpm) {
    float duty_cycle = (float)target_rpm / MAX_BLDC_RPM * 100.0f;
    mcpwm_set_duty(MCPWM_UNIT_0, MCPWM_TIMER_0, MCPWM_OPR_A, duty_cycle);
    mcpwm_set_duty_type(MCPWM_UNIT_0, MCPWM_TIMER_0, MCPWM_OPR_A, MCPWM_DUTY_MODE_0);
}

void I2C_TempSensor_ReadTask(void *pvParameters) {
    while(1) {
        g_chimney_state.heater_temp_celsius = Read_I2C_Temperature_SNS();
        TFT_Display_Update_Temperature(g_chimney_state.heater_temp_celsius);
        vTaskDelay(pdMS_TO_TICKS(500));
    }
}`,

    can_fota: `// STM32H5 Secure FOTA & AIS-140 Protocol Handler
#include "stm32h5xx_hal.h"
#include "cmsis_os2.h"
#include "mbedtls/aes.h"

void System_Init(void) {
    HAL_Init();
    SystemClock_Config();
    MX_FDCAN1_Init();
    MX_FLASH_SPI_Init();
    
    // Initialize FreeRTOS FOTA Task
    const osThreadAttr_t fotaTask_attr = {
        .name = "FotaTask",
        .priority = osPriorityHigh,
        .stack_size = 2048 * 4
    };
    osThreadNew(FOTA_ProcessTask, NULL, &fotaTask_attr);
}

void FOTA_ProcessTask(void *argument) {
    AES_256_Key_Decrypt(&enc_firmware_header);
    if(Verify_SHA256_Checksum(SPI_FLASH_ADDR) == SUCCESS) {
        Jump_To_Bootloader_Bank2();
    }
}`,

    bms_bal: `// 4S-16S BMS Battery Cell Balancing & Fuel Gauge Driver
#include "bq76952_driver.h"
#include "stm32f0xx_hal_i2c.h"

typedef struct {
    uint16_t cell_voltages[32];
    int16_t  pack_current_mA;
    uint8_t  state_of_charge_pct;
    float    pack_temperature_C;
} BMS_Metrics_t;

BMS_Metrics_t g_bms_status;

void BMS_CellBalance_Update(void) {
    uint16_t min_cell = 4200, max_cell = 0;
    for(int i = 0; i < 32; i++) {
        g_bms_status.cell_voltages[i] = BQ76952_ReadCellVoltage(i);
        if(g_bms_status.cell_voltages[i] > max_cell) max_cell = g_bms_status.cell_voltages[i];
        if(g_bms_status.cell_voltages[i] < min_cell) min_cell = g_bms_status.cell_voltages[i];
    }
    
    if((max_cell - min_cell) > BALANCE_DELTA_THRESHOLD_MV) {
        BQ76952_EnableCellBalancing(max_cell_index);
    }
}`,

    mqtt_iot: `// Quectel EC200U 4G LTE MQTT & Telemetry Gateway
#include "quectel_at_driver.h"

int MQTT_PublishTelemetry(const char* topic, const char* json_payload) {
    char cmd[512];
    snprintf(cmd, sizeof(cmd), "AT+QMTPUBEX=0,0,0,0,\\"%s\\",%d", topic, (int)strlen(json_payload));
    
    if (AT_SendCommand(cmd, "OK", 2000) == AT_SUCCESS) {
        AT_SendRawData((uint8_t*)json_payload, strlen(json_payload));
        return 0; // Success
    }
    return -1; // Retry over LTE
}`
  };

  const codeContainer = document.getElementById('terminalCode');
  const terminalTabs = document.querySelectorAll('.terminal-tab');
  const copyBtn = document.getElementById('copyCodeBtn');

  if (codeContainer && terminalTabs.length > 0) {
    terminalTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        terminalTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const key = tab.getAttribute('data-snippet');
        if (snippets[key]) {
          codeContainer.textContent = snippets[key];
        }
      });
    });
  }

  if (copyBtn && codeContainer) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(codeContainer.textContent).then(() => {
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
        setTimeout(() => {
          copyBtn.innerHTML = originalText;
        }, 2000);
      });
    });
  }

  // 5. Skills Category Filter
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');

        skillCards.forEach(card => {
          if (filter === 'all' || card.getAttribute('data-category') === filter) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.4s ease';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // 6. Project Modal Logic
  const modalOverlay = document.getElementById('projectModal');
  const modalClose = document.getElementById('modalClose');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');

  const projectDetails = {
    'bldc_appliance': {
      title: 'BLDC Motor Driver & Smart Appliance Control Platform',
      content: `<p><strong>Overview:</strong> Lead firmware design and validation engineer for high-efficiency single-phase and 3-phase HV/LV BLDC motor platforms powering smart exhaust fans, chimneys, and ventilation systems.</p>
      <br>
      <p><strong>Key Highlights:</strong></p>
      <ul style="list-style: square; padding-left: 20px; color: #94a3b8; margin-top: 8px;">
        <li>Microcontrollers: ESP32-C3, HT8/32, TI, Holtek, Microchip</li>
        <li>Motor Control: Single-phase & 3-phase High Voltage (HV) and Low Voltage (LV) BLDC motor platforms</li>
        <li>Smart Controls: Integrated Real-Time Clock (RTC), I²C Temperature Sensors, and PWM Heater Control modules</li>
        <li>Hardware Validation: Debugged & validated exhaust fan and ventilation PCBs, ensuring high stability and thermal efficiency</li>
        <li>Cross-Product Integration: Firmware optimization, hardware driver development, and client demonstration builds</li>
      </ul>`
    },
    'tft_touch_gui': {
      title: 'Smart Water Geyser & Chimney TFT Touch Display Interface',
      content: `<p><strong>Overview:</strong> Designed and implemented interactive color TFT touch display interfaces (1.28”, 3.5”, 4.0”) and Wi-Fi/BLE IoT control frameworks for smart home appliances.</p>
      <br>
      <p><strong>Key Highlights:</strong></p>
      <ul style="list-style: square; padding-left: 20px; color: #94a3b8; margin-top: 8px;">
        <li>Hardware Framework: WT32-SC01 touch display hardware with ESP-IDF framework</li>
        <li>GUI Displays: 1.28-inch circular TFTs, 3.5-inch, and 4.0-inch capacitive touch panels</li>
        <li>Connectivity: Wi-Fi app remote control, BLE provisioning, MQTTS cloud telemetry, and IR remote control</li>
        <li>Applications: Smart Water Geysers, Modular Kitchen Chimneys & Air Exhaust Systems</li>
      </ul>`
    },
    'ais140': {
      title: 'AIS-140 Automotive Vehicle Telematics System',
      content: `<p><strong>Overview:</strong> Designed and deployed commercial AIS-140 compliant vehicle tracking hardware and telematics fleet units.</p>
      <br>
      <p><strong>Key Highlights:</strong></p>
      <ul style="list-style: square; padding-left: 20px; color: #94a3b8; margin-top: 8px;">
        <li>Microcontrollers: STM32F091, STM32H5 Series (ARM Cortex-M33 with TrustZone)</li>
        <li>Cellular & Location: Quectel EC200U-CN 4G LTE Modem, IRNSS (NavIC) + GPS</li>
        <li>Protocols: AIS-140 / AIS-123 standard protocols, FDCAN, Modbus RTU, MQTT, LwM2M</li>
        <li>Security & Encryption: AES-128 / AES-256 CBC & ECB, Secure Bootloader with Cryptographic verification</li>
        <li>FOTA Engine: Dual-bank SPI Flash Over-The-Air firmware update mechanism</li>
      </ul>`
    },
    'bms': {
      title: 'Smart 4S - 16S Battery Management System (BMS)',
      content: `<p><strong>Overview:</strong> High-precision lithium-ion battery management unit for electric vehicles and energy storage systems.</p>
      <br>
      <p><strong>Key Highlights:</strong></p>
      <ul style="list-style: square; padding-left: 20px; color: #94a3b8; margin-top: 8px;">
        <li>Microcontrollers & AFE: STM32F091 paired with TI BQ76942 / BQ76952 Analog Front End</li>
        <li>Features: Active & Passive Cell Balancing, Coulomb Counting, SOC/SOH Estimation, Over-current & Thermal Protection</li>
        <li>Interfaces: Bluetooth Low Energy (BLE) mobile dashboard, CAN Bus, I2C, SPI Flash data logging</li>
        <li>Cell Count Support: 4S, 8S, 16S pack configurations</li>
      </ul>`
    },
    'pump': {
      title: 'Industrial Pump Monitoring & Control Gateway',
      content: `<p><strong>Overview:</strong> Heavy-duty industrial IoT gateway for real-time telemetry, remote monitoring, and automated pump actuation.</p>
      <br>
      <p><strong>Key Highlights:</strong></p>
      <ul style="list-style: square; padding-left: 20px; color: #94a3b8; margin-top: 8px;">
        <li>MCU & Connectivity: STM32G474 + Quectel EC200U-CN 4G Modem + BLE</li>
        <li>Industrial Protocols: Modbus RTU (RS-485), MQTT, HTTP REST APIs</li>
        <li>Storage: High-reliability Internal Flash log buffer & External SPI Flash</li>
        <li>Features: Sensor signal conditioning (4-20mA, pressure, flow rate), relay trigger output, remote OTA configuration</li>
      </ul>`
    },
    'dms': {
      title: 'Driver Monitoring System (DMS) with Voice Box',
      content: `<p><strong>Overview:</strong> Automotive safety system designed to prevent driver fatigue and broadcast audio/voice safety alerts.</p>
      <br>
      <p><strong>Key Highlights:</strong></p>
      <ul style="list-style: square; padding-left: 20px; color: #94a3b8; margin-top: 8px;">
        <li>Core Architecture: STM32F091 + Quectel 4G LTE Gateway</li>
        <li>Audio & Voice: USART audio DAC voice synthesizer for real-time audible driver warnings</li>
        <li>Interfacing: RS-485 vehicle sensors, SPI Flash voice prompts library</li>
      </ul>`
    },
    'ups': {
      title: 'Remote UPS Telemetry & Monitoring System',
      content: `<p><strong>Overview:</strong> Scalable remote monitoring architecture for industrial UPS power systems, deployed across 1,000+ commercial units.</p>
      <br>
      <p><strong>Key Highlights:</strong></p>
      <ul style="list-style: square; padding-left: 20px; color: #94a3b8; margin-top: 8px;">
        <li>Platform: ESP32 with ESP-IDF framework</li>
        <li>Controllers supported: STM8, STM32, dsPIC30F3011</li>
        <li>Telemetry: Real-time AC voltage, current, battery SOC telemetry over Wi-Fi/MQTT</li>
      </ul>`
    }
  };

  document.querySelectorAll('.open-project-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projId = btn.getAttribute('data-project');
      if (projectDetails[projId]) {
        modalTitle.textContent = projectDetails[projId].title;
        modalBody.innerHTML = projectDetails[projId].content;
        modalOverlay.classList.add('active');
      }
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
    });
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
      }
    });
  }

  // 7. Contact Form Handling
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('formName').value;
      const email = document.getElementById('formEmail').value;
      const message = document.getElementById('formMessage').value;

      if (formStatus) {
        formStatus.style.display = 'block';
        formStatus.innerHTML = '<span style="color: var(--accent-emerald)"><i class="fa-solid fa-circle-check"></i> Thank you, ' + name + '! Your message has been prepared. Redirecting to mail client...</span>';
      }

      setTimeout(() => {
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=tecsantoshkumar63@gmail.com&su=${encodeURIComponent("Portfolio Contact from " + name)}&body=${encodeURIComponent(message + "\n\nFrom: " + name + " (" + email + ")")}`;
        window.open(gmailUrl, '_blank') || (window.location.href = `mailto:tecsantoshkumar63@gmail.com?subject=Portfolio Contact from ${encodeURIComponent(name)}&body=${encodeURIComponent(message + "\n\nFrom: " + name + " (" + email + ")")}`);
        contactForm.reset();
      }, 1200);
    });
  }

  // 8. AI Chatbot Logic
  const chatbotTrigger = document.getElementById('chatbotTrigger');
  const chatbotWindow = document.getElementById('chatbotWindow');
  const chatbotClose = document.getElementById('chatbotClose');
  const chatbotBody = document.getElementById('chatbotBody');
  const chatbotInput = document.getElementById('chatbotInput');
  const chatbotSend = document.getElementById('chatbotSend');
  const chatbotOptions = document.querySelectorAll('.chatbot-option-btn');

  function toggleChatbot() {
    if (chatbotWindow) {
      chatbotWindow.classList.toggle('active');
      if (chatbotWindow.classList.contains('active') && chatbotInput) {
        chatbotInput.focus();
      }
    }
  }

  if (chatbotTrigger) {
    chatbotTrigger.addEventListener('click', toggleChatbot);
  }

  if (chatbotClose) {
    chatbotClose.addEventListener('click', toggleChatbot);
  }

  function formatTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function appendUserMessage(text) {
    if (!chatbotBody) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = 'chat-msg user';
    msgDiv.innerHTML = `
      <div class="chat-msg-avatar"><i class="fa-solid fa-user"></i></div>
      <div class="chat-msg-bubble-container">
        <div class="chat-msg-bubble">${escapeHtml(text)}</div>
        <div class="chat-msg-meta">${formatTime()}</div>
      </div>
    `;
    chatbotBody.appendChild(msgDiv);
    chatbotBody.scrollTop = chatbotBody.scrollHeight;
  }

  function appendBotMessage(text) {
    if (!chatbotBody) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = 'chat-msg bot';
    const copyText = text.replace(/'/g, "\\'");
    msgDiv.innerHTML = `
      <div class="chat-msg-avatar"><i class="fa-solid fa-robot"></i></div>
      <div class="chat-msg-bubble-container">
        <div class="chat-msg-bubble">${text}</div>
        <div class="chat-msg-meta">${formatTime()}</div>
        <div class="chat-msg-actions">
          <i class="far fa-copy" title="Copy text" onclick="navigator.clipboard.writeText('${copyText}')"></i>
          <i class="far fa-thumbs-up" title="Like"></i>
          <i class="far fa-thumbs-down" title="Dislike"></i>
        </div>
      </div>
    `;
    chatbotBody.appendChild(msgDiv);
    chatbotBody.scrollTop = chatbotBody.scrollHeight;
  }

  function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function generateAIResponse(userQuery) {
    const query = userQuery.toLowerCase();

    if (query.includes('bldc') || query.includes('motor') || query.includes('fan') || query.includes('chimney')) {
      return "🌀 <strong>BLDC Motor Drivers:</strong> Santosh has led firmware design & validation for single-phase and 3-phase HV/LV BLDC motor drivers powering exhaust fans and smart chimney modules. Built on <strong>ESP32-C3 & ESP-IDF</strong> with RTC, I²C temperature sensors, and PWM heater speed control!";
    }
    
    if (query.includes('bms') || query.includes('battery') || query.includes('cell') || query.includes('4s')) {
      return "🔋 <strong>Smart 4S - 16S BMS:</strong> High-precision Lithium-ion Battery Management Systems engineered with STM32F091 microcontrollers paired with <strong>TI BQ76942 / BQ76952 AFEs</strong>! Features active/passive cell balancing, BLE dashboard, CAN Bus, and SPI Flash logging.";
    }

    if (query.includes('ais') || query.includes('telematics') || query.includes('vts') || query.includes('vehicle') || query.includes('automotive')) {
      return "🚗 <strong>AIS-140 Automotive Telematics:</strong> Commercial vehicle tracking devices (VTS) engineered with <strong>STM32H5 & STM32F0</strong> microcontrollers, Quectel 4G LTE modems, FDCAN, IRNSS (NavIC), and secure AES-256 encrypted dual-bank FOTA bootloaders!";
    }

    if (query.includes('tft') || query.includes('display') || query.includes('gui') || query.includes('touch') || query.includes('screen')) {
      return "🖥️ <strong>TFT Touch GUIs:</strong> Designed interactive color TFT touch screen interfaces (1.28”, 3.5”, and 4.0” panels) using <strong>WT32-SC01</strong> displays with ESP-IDF, Wi-Fi, BLE, and IR remote control for smart home appliances!";
    }

    if (query.includes('contact') || query.includes('email') || query.includes('phone') || query.includes('reach') || query.includes('hire')) {
      return "📞 <strong>Contact Santosh Kumar:</strong><br>• <strong>Email:</strong> <a href='https://mail.google.com/mail/?view=cm&fs=1&to=tecsantoshkumar63@gmail.com' target='_blank' style='color: var(--accent-cyan)'>tecsantoshkumar63@gmail.com</a><br>• <strong>Phone:</strong> <a href='tel:+916306753746' style='color: var(--accent-cyan)'>+91 6306753746</a><br>• <strong>Location:</strong> Janakpuri, Mayapuri, New Delhi, India";
    }

    if (query.includes('skill') || query.includes('mcu') || query.includes('stm32') || query.includes('esp32') || query.includes('rtos') || query.includes('tool')) {
      return "🛠️ <strong>Technical Expertise:</strong> 4.10+ Years in Embedded Firmware! Core MCUs include <strong>STM32, ESP32-C3, HT8/32, TI, CH32, dsPIC30F</strong>. Proficient in Embedded C, C++, FreeRTOS, FDCAN, Modbus RS-485, MQTT, AES-256, and Altium Designer.";
    }

    if (query.includes('experience') || query.includes('year') || query.includes('background')) {
      return "💼 <strong>Experience Overview:</strong> Santosh has <strong>4.10+ years of total experience</strong> as a Senior Embedded Firmware Engineer in New Delhi, specializing in smart home IoT appliances, automotive telematics, BMS, and secure FOTA cloud gateways.";
    }

    return "🤖 Thank you for your question! Santosh is specialized in <strong>BLDC motor drivers</strong>, <strong>4S-16S Smart BMS</strong>, <strong>AIS-140 Telematics</strong>, and <strong>TFT Touch Displays</strong>. You can click any suggestion chip above or leave a direct message in the contact form!";
  }

  function handleSend() {
    if (!chatbotInput) return;
    const text = chatbotInput.value.trim();
    if (!text) return;

    appendUserMessage(text);
    chatbotInput.value = '';

    setTimeout(() => {
      const response = generateAIResponse(text);
      appendBotMessage(response);
    }, 600);
  }

  if (chatbotSend) {
    chatbotSend.addEventListener('click', handleSend);
  }

  if (chatbotInput) {
    chatbotInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleSend();
      }
    });
  }

  if (chatbotOptions.length > 0) {
    chatbotOptions.forEach(btn => {
      btn.addEventListener('click', () => {
        const question = btn.getAttribute('data-question');
        if (question && chatbotInput) {
          chatbotInput.value = question;
          handleSend();
        }
      });
    });
  }

  // 9. Footer Quick Inquiry Handler
  const footerInquiryBtn = document.getElementById('footerInquiryBtn');
  const footerEmailInput = document.getElementById('footerEmailInput');

  if (footerInquiryBtn && footerEmailInput) {
    footerInquiryBtn.addEventListener('click', () => {
      const email = footerEmailInput.value.trim();
      if (email) {
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=tecsantoshkumar63@gmail.com&su=${encodeURIComponent("Quick Firmware Inquiry")}&body=${encodeURIComponent("Hello Santosh,\n\nI would like to discuss a firmware project with you.\n\nMy Email: " + email)}`;
        window.open(gmailUrl, '_blank') || (window.location.href = `mailto:tecsantoshkumar63@gmail.com?subject=Quick Firmware Inquiry&body=Hello Santosh,%0A%0AI would like to discuss a firmware project with you.%0A%0AEmail: ${encodeURIComponent(email)}`);
        footerEmailInput.value = '';
      }
    });
  }
});
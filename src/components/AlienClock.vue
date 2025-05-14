<template>
  <div class="alien-universe" ref="universe" @mousemove="trackMouse" @click="expandStars">
    <!-- Starfield canvas in background -->
    <canvas ref="starfield" class="starfield"></canvas>

    <!-- Main clock container -->
    <div class="clock-container">
      <div class="alien-clock">
        <!-- Clock display -->
        <div class="clock-face">
          <div class="time-display">
            <div class="time">{{ formatAlienTime }}</div>
            <div class="date">{{ formatAlienDate }}</div>
            <div class="earth-time">Earth: {{ formatEarthDateTime }}</div>
          </div>
          
          <!-- Clock controls -->
          <div class="clock-controls">
            <button @click="toggleSetTime" class="alien-button">
              {{ isSettingTime ? 'Cancel' : 'Set Time' }}
            </button>
            <button @click="toggleSetAlarm" class="alien-button" v-if="!isSettingTime">
              {{ isSettingAlarm ? 'Cancel Alarm' : 'Set Alarm' }}
            </button>
            <button @click="toggleStory" class="alien-button" v-if="!isSettingTime && !isSettingAlarm">
              {{ showStory ? 'Hide Story' : 'Show Story' }}
            </button>
          </div>
        </div>

        <!-- Time setting form -->
        <div class="time-setter" v-if="isSettingTime">
          <h3>Set Alien Date & Time</h3>
          <div class="time-inputs">
            <div class="input-group">
              <label>Year:</label>
              <input type="number" v-model.number="timeForm.year" min="1" tabindex="1" />
            </div>
            <div class="input-group">
              <label>Month:</label>
              <input type="number" v-model.number="timeForm.month" min="1" max="18" tabindex="2" />
            </div>
            <div class="input-group">
              <label>Day:</label>
              <input 
                type="number" 
                v-model.number="timeForm.day" 
                min="1" 
                :max="getDaysInMonth(timeForm.month)" 
                tabindex="3"
              />
            </div>
            <div class="input-group">
              <label>Hour:</label>
              <input type="number" v-model.number="timeForm.hour" min="0" max="35" tabindex="4" />
            </div>
            <div class="input-group">
              <label>Minute:</label>
              <input type="number" v-model.number="timeForm.minute" min="0" max="89" tabindex="5" />
            </div>
            <div class="input-group">
              <label>Second:</label>
              <input type="number" v-model.number="timeForm.second" min="0" max="89" tabindex="6" />
            </div>
          </div>
          <div class="validation-error" v-if="validationError">{{ validationError }}</div>
          <button @click="setAlienTime" class="alien-button confirm" tabindex="7">Confirm</button>
        </div>

        <!-- Alarm setting form -->
        <div class="alarm-setter" v-if="isSettingAlarm && !isSettingTime">
          <h3>Set Alarm</h3>
          <div class="time-inputs">
            <div class="input-group">
              <label>Hour:</label>
              <input type="number" v-model.number="alarmForm.hour" min="0" max="35" tabindex="1" />
            </div>
            <div class="input-group">
              <label>Minute:</label>
              <input type="number" v-model.number="alarmForm.minute" min="0" max="89" tabindex="2" />
            </div>
          </div>
          <div class="validation-error" v-if="validationError">{{ validationError }}</div>
          <button @click="setAlarm" class="alien-button confirm" tabindex="3">Set Alarm</button>
        </div>

        <!-- Alarm notification -->
        <div class="alarm-notification" v-if="alarmActive">
          <div class="alarm-message">ALARM ACTIVATED!</div>
          <button @click="stopAlarm" class="alien-button" tabindex="1">Stop</button>
        </div>

        <!-- Story section -->
        <div class="story-section" v-if="showStory">
          <h3 class="story-title">Nebula Wanderer</h3>
          <div class="story-content" v-html="currentStoryPage"></div>
          <div class="story-controls">
            <button @click="prevStoryPage" :disabled="currentPage === 0" class="alien-button">Prev</button>
            <span class="page-indicator">{{ currentPage + 1 }} / {{ totalPages }}</span>
            <button @click="nextStoryPage" :disabled="currentPage === totalPages - 1" class="alien-button">Next</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AlienClock from '../js/AlienClock.js';
export default AlienClock;
</script>
<style scoped>
@import '../assets/AlienClock.css';
</style>
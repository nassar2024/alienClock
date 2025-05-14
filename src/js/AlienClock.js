export default {
  data() {
    return {
      // Current alien time
      alienTime: {
        year: 2804,
        month: 18,
        day: 31,
        hour: 2,
        minute: 2,
        second: 88
      },
      // Earth epoch reference
      earthEpoch: new Date('1970-01-01T00:00:00Z'),
      // Mouse tracking for stars
      mouseX: 0,
      mouseY: 0,
      // Starfield data
      stars: [],
      expandEffect: false,
      expandTimer: null,
      // Time setting form
      timeForm: {
        year: 2804,
        month: 18,
        day: 31,
        hour: 2,
        minute: 2,
        second: 88
      },
      // UI state
      isSettingTime: false,
      validationError: '',
      // Alarm settings
      isSettingAlarm: false,
      alarmForm: {
        hour: 0,
        minute: 0
      },
      alarmTime: null,
      alarmActive: false,
      alarmSound: null,
      // Days in each alien month
      daysInMonth: [44, 42, 48, 40, 48, 44, 40, 44, 42, 40, 40, 42, 44, 48, 42, 40, 44, 38],
      // Story data
      showStory: false,
      currentPage: 0,
      storyPages: [
        `
            <p>In the year 2804, Captain Elara flies her spaceship, the <em>Nebula Wanderer</em>, to visit new planets. She loves exploring with her alien friends, but she has a big problem. Time on Earth is different from time on other planets.</p>
        `,
        `
            <p>Elara misses her Earth friend's birthdays because of the time difference. She feels sad missing these special days with her friends.</p>
        `,
        `
            <p>So, Elara decides to make a special toy called the Alien Clock. She wants to keep track of Earth time while she’s on other planets. That way, she can always know when it’s time to call her friends or send them birthday wishes, no matter where she is in space!</p>
        `,
        `
            <p>Elara creates the Alien Clock with her alien buddies. Now, she never misses a special moment with her Earth friends. The Alien Clock helps her feel close to home, even when she’s far away exploring new planets with her alien buddies!</p>
        `
        ]
    };
  },
  computed: {
    formatAlienTime() {
      return `${this.padZero(this.alienTime.hour)}:${this.padZero(this.alienTime.minute)}:${this.padZero(this.alienTime.second)}`;
    },
    formatAlienDate() {
      return `Year ${this.alienTime.year}, Month ${this.alienTime.month}, Day ${this.alienTime.day}`;
    },
    formatEarthDateTime() {
      const earthDate = this.alienToEarthTime();
      return earthDate.toLocaleString('en-US', { timeZone: 'Asia/Singapore' });
    },
    currentStoryPage() {
      return this.storyPages[this.currentPage];
    },
    totalPages() {
      return this.storyPages.length;
    }
  },
  mounted() {
    this.startClock();
    this.alarmSound = new Audio('https://assets.mixkit.co/active_storage/sfx/914/914-preview.mp3');
    this.alarmSound.loop = true;
    this.initStarfield();
    this.animateStarfield();
  },
  beforeUnmount() {
    clearInterval(this.clockInterval);
    cancelAnimationFrame(this.animationFrame);
    if (this.expandTimer) clearTimeout(this.expandTimer);
  },
  methods: {
    startClock() {
      this.clockInterval = setInterval(() => {
        this.tickAlienClock();
        this.checkAlarm();
      }, 500);
    },
    tickAlienClock() {
      this.alienTime.second++;
      if (this.alienTime.second >= 90) {
        this.alienTime.second = 0;
        this.alienTime.minute++;
        if (this.alienTime.minute >= 90) {
          this.alienTime.minute = 0;
          this.alienTime.hour++;
          if (this.alienTime.hour >= 36) {
            this.alienTime.hour = 0;
            this.alienTime.day++;
            const daysInCurrentMonth = this.getDaysInMonth(this.alienTime.month);
            if (this.alienTime.day > daysInCurrentMonth) {
              this.alienTime.day = 1;
              this.alienTime.month++;
              if (this.alienTime.month > 18) {
                this.alienTime.month = 1;
                this.alienTime.year++;
              }
            }
          }
        }
      }
    },
    alienToEarthTime() {
      let totalAlienSeconds = 0;
      for (let y = 2804; y < this.alienTime.year; y++) {
        totalAlienSeconds += this.getTotalSecondsInAlienYear();
      }
      for (let m = 1; m < this.alienTime.month; m++) {
        totalAlienSeconds += this.getDaysInMonth(m) * 36 * 90 * 90;
      }
      totalAlienSeconds += (this.alienTime.day - 1) * 36 * 90 * 90;
      totalAlienSeconds += this.alienTime.hour * 90 * 90;
      totalAlienSeconds += this.alienTime.minute * 90;
      totalAlienSeconds += this.alienTime.second;
      totalAlienSeconds -= 88;
      totalAlienSeconds -= 2 * 90;
      totalAlienSeconds -= 2 * 90 * 90;
      totalAlienSeconds -= 31 * 36 * 90 * 90;
      totalAlienSeconds -= this.getTotalSecondsInAlienMonths(18);
      const earthMilliseconds = totalAlienSeconds * 500;
      return new Date(this.earthEpoch.getTime() + earthMilliseconds);
    },
    getDaysInMonth(month) {
      return this.daysInMonth[month - 1] || 30;
    },
    getTotalSecondsInAlienMonths(upToMonth) {
      let totalSeconds = 0;
      for (let m = 1; m < upToMonth; m++) {
        totalSeconds += this.getDaysInMonth(m) * 36 * 90 * 90;
      }
      return totalSeconds;
    },
    getTotalSecondsInAlienYear() {
      let totalDays = 0;
      for (let m = 1; m <= 18; m++) {
        totalDays += this.getDaysInMonth(m);
      }
      return totalDays * 36 * 90 * 90;
    },
    trackMouse(event) {
      const rect = this.$refs.universe.getBoundingClientRect();
      this.mouseX = event.clientX - rect.left;
      this.mouseY = event.clientY - rect.top;
    },
    initStarfield() {
      const canvas = this.$refs.starfield;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      this.stars = [];
      for (let i = 0; i < 100; i++) {
        this.stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 4 + 2,
          vx: 0,
          vy: 0,
          baseSize: Math.random() * 4 + 2
        });
      }
      window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        this.stars.forEach(star => {
          star.x = Math.min(star.x, canvas.width);
          star.y = Math.min(star.y, canvas.height);
        });
      });
    },
    animateStarfield() {
      const canvas = this.$refs.starfield;
      const ctx = canvas.getContext('2d');
      const animate = () => {
        ctx.fillStyle = 'rgba(10, 10, 42, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        this.stars.forEach(star => {
          // Mouse repulsion
          const dx = star.x - this.mouseX;
          const dy = star.y - this.mouseY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = 150;
          if (distance < maxDistance) {
            const force = (maxDistance - distance) / maxDistance;
            star.vx += (dx / distance) * force * 2;
            star.vy += (dy / distance) * force * 2;
          }
          star.vx *= 0.95;
          star.vy *= 0.95;
          star.x += star.vx;
          star.y += star.vy;
          if (star.x < 0) star.x += canvas.width;
          if (star.x > canvas.width) star.x -= canvas.width;
          if (star.y < 0) star.y += canvas.height;
          if (star.y > canvas.height) star.y -= canvas.height;
          // Alarm-based expansion
          if (this.alarmActive) {
            const pulse = Math.sin(Date.now() * 0.005) * 0.5 + 1.5; // Pulsing effect
            star.size = star.baseSize * pulse;
          }
          ctx.fillStyle = '#7eff9a';
          ctx.fillRect(
            star.x - star.size / 2,
            star.y - star.size / 2,
            star.size,
            star.size
          );
        });
        this.animationFrame = requestAnimationFrame(animate);
      };
      animate();
    },
    expandStars() {
      this.expandEffect = true;
      // Expand existing stars
      this.stars.forEach(star => {
        star.size = star.baseSize * 2;
      });
      // Add new stars
      const canvas = this.$refs.starfield;
      for (let i = 0; i < 10; i++) {
        this.stars.push({
          x: this.mouseX + (Math.random() - 0.5) * 50,
          y: this.mouseY + (Math.random() - 0.5) * 50,
          size: Math.random() * 4 + 2,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          baseSize: Math.random() * 4 + 2
        });
      }
      if (this.expandTimer) clearTimeout(this.expandTimer);
      this.expandTimer = setTimeout(() => {
        this.expandEffect = false;
        this.stars.forEach(star => {
          if (!this.alarmActive) {
            star.size = star.baseSize;
          }
        });
      }, 300);
    },
    toggleSetTime() {
      this.isSettingTime = !this.isSettingTime;
      if (this.isSettingTime) {
        this.timeForm = { ...this.alienTime };
        this.isSettingAlarm = false;
        this.showStory = false;
      }
      this.validationError = '';
    },
    toggleSetAlarm() {
      this.isSettingAlarm = !this.isSettingAlarm;
      this.alarmForm = {
        hour: this.alienTime.hour,
        minute: this.alienTime.minute
      };
      if (this.isSettingAlarm) this.showStory = false;
      this.validationError = '';
    },
    toggleStory() {
      this.showStory = !this.showStory;
      if (this.showStory) {
        this.isSettingTime = false;
        this.isSettingAlarm = false;
      }
    },
    setAlienTime() {
      const timeForm = {
        year: parseInt(this.timeForm.year, 10),
        month: parseInt(this.timeForm.month, 10),
        day: parseInt(this.timeForm.day, 10),
        hour: parseInt(this.timeForm.hour, 10),
        minute: parseInt(this.timeForm.minute, 10),
        second: parseInt(this.timeForm.second, 10)
      };
      if (!this.validateTimeForm(timeForm)) {
        return;
      }
      this.alienTime = { ...timeForm };
      this.isSettingTime = false;
      this.validationError = '';
    },
    validateTimeForm(form) {
      this.validationError = '';
      if (isNaN(form.year) || form.year < 1) {
        this.validationError = 'Year must be a positive integer';
        return false;
      }
      if (isNaN(form.month) || form.month < 1 || form.month > 18) {
        this.validationError = 'Month must be between 1 and 18';
        return false;
      }
      const maxDays = this.getDaysInMonth(form.month);
      if (isNaN(form.day) || form.day < 1 || form.day > maxDays) {
        this.validationError = `Day must be between 1 and ${maxDays} for month ${form.month}`;
        return false;
      }
      if (isNaN(form.hour) || form.hour < 0 || form.hour >= 36) {
        this.validationError = 'Hour must be between 0 and 35';
        return false;
      }
      if (isNaN(form.minute) || form.minute < 0 || form.minute >= 90) {
        this.validationError = 'Minute must be between 0 and 89';
        return false;
      }
      if (isNaN(form.second) || form.second < 0 || form.second >= 90) {
        this.validationError = 'Second must be between 0 and 89';
        return false;
      }
      return true;
    },
    setAlarm() {
      const alarmForm = {
        hour: parseInt(this.alarmForm.hour, 10),
        minute: parseInt(this.alarmForm.minute, 10)
      };
      if (isNaN(alarmForm.hour) || alarmForm.hour < 0 || alarmForm.hour >= 36) {
        this.validationError = 'Alarm hour must be between 0 and 35';
        return;
      }
      if (isNaN(alarmForm.minute) || alarmForm.minute < 0 || alarmForm.minute >= 90) {
        this.validationError = 'Alarm minute must be between 0 and 89';
        return;
      }
      this.alarmTime = {
        hour: alarmForm.hour,
        minute: alarmForm.minute
      };
      this.isSettingAlarm = false;
      this.validationError = '';
    },
    checkAlarm() {
      if (this.alarmTime && 
          this.alienTime.hour === this.alarmTime.hour && 
          this.alienTime.minute === this.alarmTime.minute && 
          this.alienTime.second === 0) {
        this.triggerAlarm();
      }
    },
    triggerAlarm() {
      this.alarmActive = true;
      this.alarmSound.play();
    },
    stopAlarm() {
      this.alarmActive = false;
      this.alarmTime = null;
      this.alarmSound.pause();
      this.alarmSound.currentTime = 0;
      // Reset star sizes when alarm stops
      this.stars.forEach(star => {
        star.size = star.baseSize;
      });
    },
    padZero(num) {
      return num.toString().padStart(2, '0');
    },
    prevStoryPage() {
      if (this.currentPage > 0) this.currentPage--;
    },
    nextStoryPage() {
      if (this.currentPage < this.totalPages - 1) this.currentPage++;
    }
  }
};
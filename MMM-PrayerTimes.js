/* Magic Mirror
 * Module: MMM-PrayerTimes
 *
 * By Moin Ahmed
 *
 */
Module.register("MMM-PrayerTimes", {

    // Module config defaults.
    defaults: {
        useHeader: true, // false if you don't want a header
        header: "Prayer Times", // Any text you want
        animationSpeed: 3000, // fade in and out speed
        initialLoadDelay: 4250,
        updateInterval: 30 * 60 * 1000,
        masjidId: 5663,
        timeFormat: 12,
    },

    getStyles: function() {
        return ["MMM-PrayerTimes.css"];
    },

    start: function() {
        Log.info("Starting module: " + this.name);

        requiresVersion: "2.1.0",

        // Set locale.
        this.url = "https://www.masjidnow.com/api/v2/salah_timings/daily.json?masjid_id="+this.config.masjidId;
        this.PrayerTimes = [];
        this.scheduleUpdate();       // <-- When the module updates (see below)
    },

    getDom: function() {

		// creating the wrapper
        var wrapper = document.createElement("div");
        wrapper.className = "thin bright pre-line";
        // wrapper.style.maxWidth = this.config.maxWidth;

		// The loading sequence
        if (!this.loaded) {
            wrapper.innerHTML = "Prayer times appearing ..!";
            wrapper.classList.add("bright", "light", "small");
            return wrapper;
        }

		// creating the header
        if (this.config.useHeader != false) {
            var header = document.createElement("header");
            header.classList.add("xsmall", "bright", "light", "header");
            header.innerHTML = this.config.header;
            wrapper.appendChild(header);
        }
        fajrDiv = this.createDiv("Fajr", this.PrayerTimes.fajr_adhan);
        wrapper.appendChild(fajrDiv)
        dhuhrDiv = this.createDiv("Dhuhr", this.PrayerTimes.dhuhr_adhan);
        wrapper.appendChild(dhuhrDiv)
        asrDiv = this.createDiv("Asr", this.PrayerTimes.asr_adhan);
        wrapper.appendChild(asrDiv)
        maghribDiv = this.createDiv("Maghrib", this.PrayerTimes.maghrib_adhan);
        wrapper.appendChild(maghribDiv)
        ishaDiv = this.createDiv("Isha", this.PrayerTimes.isha_adhan);
        wrapper.appendChild(ishaDiv)

        return wrapper;

    }, // <-- closes the getDom function from above

    createDiv: function(name, prayer) {
        var prayerDiv = document.createElement("span");
        if (prayer != undefined){
            prayerDiv.classList.add("left-text");
            prayerDiv.innerHTML = name + ": " + prayer + " &nbsp;&nbsp;&nbsp; "
        }
        return prayerDiv
    },
	// this processes your data
    processPrayerTimes: function(data) {
        this.PrayerTimes = data.masjid.salah_timing;
        // console.log(this.PrayerTimes); // uncomment to see if you're getting data (in dev console)
        this.loaded = true;
    },


// this tells module when to update
    scheduleUpdate: function() {
        setInterval(() => {
            this.getPrayerTimes();
        }, this.config.updateInterval);
        this.getPrayerTimes(this.config.initialLoadDelay);
        var self = this;
    },


	// this asks node_helper for data
    getPrayerTimes: function() {
        this.sendSocketNotification('GET_PrayerTimes', this.url);
    },


	// this gets data from node_helper
    socketNotificationReceived: function(notification, payload) {
        if (notification === "PrayerTimes_RESULT") {
            this.processPrayerTimes(payload);
            this.updateDom(this.config.animationSpeed);
        }
        this.updateDom(this.config.initialLoadDelay);
    },
});

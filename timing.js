import humanInterval from "./human-interval.js";

class Timing {
  constructor(config) {
    this.config = {
      jobs: [],
      ...config,
    };

    this.timeouts = {};
    this.intervals = {};

    this.run = this.run.bind(this);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
  }

  run(name) {
    if (name) {
      const job = this.config.jobs.find((j) => j.name === name);
      job.fn();
      return;
    }
    for (const job of this.config.jobs) {
      this.run(job.name);
    }
  }

  start(name) {
    if (name) {
      const job = this.config.jobs.find((j) => j.name === name);
      if (this.timeouts[name] || this.intervals[name]) {
        return;
      }

      job.interval = humanInterval(job.interval);

      // validate timeout
      if (job.timeout instanceof Date) {
        if (job.timeout.getTime() < Date.now()) {
          return;
        }
        job.timeout = job.timeout.getTime() - Date.now();
      } else if (typeof job.timeout === "string") {
        job.timeout = humanInterval(job.timeout);
      } else if (Number.isFinite(job.timeout) && job.timeout > 0) {
        job.timeout = job.timeout;
      } else {
        return;
      }

      // execute
      this.timeouts[name] = setTimeout(() => {
        this.run(name);
        if (Number.isFinite(job.interval) && job.interval > 0) {
          this.intervals[name] = setInterval(() => {
            this.run(name);
          }, job.interval);
        }
      }, job.timeout);
      return;
    }

    for (const job of this.config.jobs) {
      this.start(job.name);
    }
  }

  stop(name) {
    if (name) {
      if (this.timeouts[name]) {
        clearTimeout(this.timeouts[name]);
        delete this.timeouts[name];
      }

      if (this.intervals[name]) {
        clearInterval(this.intervals[name]);
        delete this.intervals[name];
      }
    }
  }
}

export default Timing;

class QueueService {
    constructor() {
        this.queue = [];
        this.processing = false;
    }

    // Add job to queue
    async add(job) {
        return new Promise((resolve) => {
            this.queue.push({ job, resolve });
            this.process();
        });
    }

    // Process queue one by one
    async process() {
        if (this.processing) return;
        this.processing = true;

        while (this.queue.length > 0) {
            const item = this.queue.shift();

            try {
                const result = await this.handleJob(item.job);
                item.resolve({ success: true, result });
            } catch (err) {
                item.resolve({ success: false, error: err.message });
            }
        }

        this.processing = false;
    }

    // What actually runs each job
    async handleJob(job) {
        console.log("Processing job:", job);

        // You can route different actions here later
        switch (job.action) {
            case "Execute":
                return this.handleExecute(job);

            default:
                return { message: "Unknown job type" };
        }
    }

    // Example handler (customize this later)
    async handleExecute(job) {
        console.log("Execute job received:", job);

        return {
            message: "Execution queued successfully",
            data: job
        };
    }
}

module.exports = new QueueService();

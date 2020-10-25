class DomainError extends Error {
    constructor(message, details) {
        super(message);

        this.name = 'Domain Error';
        this.details = details;
    }
}

module.exports = {
    DomainError: DomainError
}
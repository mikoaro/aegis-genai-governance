// A simple regex-based PII redactor for the MVP.
const piiPatterns = [
    { name: 'EMAIL', regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, replacement: '[REDACTED_EMAIL]' },
    { name: 'NAME_JOHN_DOE', regex: /John Doe/gi, replacement: '[REDACTED_NAME]' },
    { name: 'ADDRESS_MAIN_ST', regex: /123 Main St/gi, replacement: '[REDACTED_ADDRESS]' },
    { name: 'INVOICE_NUMBER', regex: /INV-\d{3,}/gi, replacement: '[REDACTED_INVOICE]' }
];

export const handler = async (event) => {
    const prompt = event.prompt || '';
    let sanitizedPrompt = prompt;
    let redactionsMade = [];

    console.log('Original prompt:', prompt);

    piiPatterns.forEach(pattern => {
        if (pattern.regex.test(sanitizedPrompt)) {
            redactionsMade.push(pattern.name);
            sanitizedPrompt = sanitizedPrompt.replace(pattern.regex, pattern.replacement);
        }
    });

    const response = {
        sanitizedPrompt: sanitizedPrompt,
        wasRedacted: redactionsMade.length > 0,
        redactions: redactionsMade
    };
    
    console.log('Sanitized response:', response);

    return response;
};
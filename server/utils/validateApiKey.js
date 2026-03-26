export const validateOpenAIApiKey = (apiKey) => {
    if (!apiKey) {
        return { valid: false, error: "API key is missing" };
    }
    
    if (typeof apiKey !== 'string') {
        return { valid: false, error: "API key must be a string" };
    }
    
    if (!apiKey.startsWith('sk-')) {
        return { valid: false, error: "OpenAI API key must start with 'sk-'" };
    }
    
    if (apiKey.length < 40) {
        return { valid: false, error: "OpenAI API key appears to be too short" };
    }
    
    // Check for common issues
    if (apiKey.includes(' ')) {
        return { valid: false, error: "API key contains spaces" };
    }
    
    if (apiKey.includes('\n') || apiKey.includes('\r')) {
        return { valid: false, error: "API key contains newline characters" };
    }
    
    return { valid: true, error: null };
};

export const getApiKeyInfo = (apiKey) => {
    const validation = validateOpenAIApiKey(apiKey);
    
    return {
        exists: !!apiKey,
        length: apiKey?.length || 0,
        startsWithSk: apiKey?.startsWith('sk-') || false,
        preview: apiKey ? `${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}` : 'N/A',
        validation: validation
    };
};
// Test helper for quiz generation
export const testQuizGeneration = async (topic = "Array", level = "Easy", count = 2) => {
    try {
        const { generateQuiz } = await import('../services/Quiz/openai.service.js');
        

        
        const result = await generateQuiz({ topic, level, count });
        

        
        result.questions.forEach((q, i) => {

        });
        
        return result;
    } catch (error) {

        throw error;
    }
};

// Test code formatting specifically
export const testCodeFormatting = (questionText) => {

    
    // Test rendering
    const lines = questionText.split('\n');

    lines.forEach((line, i) => {

    });
};
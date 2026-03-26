// Test helper for quiz generation
export const testQuizGeneration = async (topic = "Array", level = "Easy", count = 2) => {
    try {
        const { generateQuiz } = await import('../services/Quiz/openai.service.js');
        
        console.log(`Testing quiz generation for ${topic} at ${level} level...`);
        
        const result = await generateQuiz({ topic, level, count });
        
        console.log('✅ Quiz generated successfully!');
        console.log('Questions:', result.questions.length);
        
        result.questions.forEach((q, i) => {
            console.log(`\nQuestion ${i + 1}:`);
            console.log('Text:', q.question.substring(0, 100) + '...');
            console.log('Options:', q.options.length);
            console.log('Correct Answer:', q.correctAnswer);
            console.log('Has Explanation:', !!q.explanation);
        });
        
        return result;
    } catch (error) {
        console.error('❌ Quiz generation failed:', error.message);
        throw error;
    }
};

// Test code formatting specifically
export const testCodeFormatting = (questionText) => {
    console.log('Testing code formatting...');
    console.log('Original:', questionText);
    console.log('Has newlines:', questionText.includes('\n'));
    console.log('Newline count:', (questionText.match(/\n/g) || []).length);
    
    // Test rendering
    const lines = questionText.split('\n');
    console.log('Lines after split:', lines.length);
    lines.forEach((line, i) => {
        console.log(`Line ${i + 1}: "${line}"`);
    });
};
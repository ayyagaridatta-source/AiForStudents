async function generateProject() {
    try {
        console.log('Generating base project...');
        const baseResponse = await fetch('http://localhost:3001/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'base' })
        });
        const baseData = await baseResponse.json();
        console.log('✅ Base project generated');

        // Wait a moment before next request
        await new Promise(resolve => setTimeout(resolve, 2000));

        console.log('Generating smart features...');
        const smartResponse = await fetch('http://localhost:3001/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'smart' })
        });
        const smartData = await smartResponse.json();
        console.log('✅ Smart features generated');

        console.log('\nCheck baseProject.txt and smartFeatures.txt for the generated code');
    } catch (error) {
        console.error('Error:', error);
    }
}

// Run the generator
generateProject();
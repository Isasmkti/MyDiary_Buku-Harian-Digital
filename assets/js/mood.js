// Mood functionality
document.addEventListener('DOMContentLoaded', function() {
    // Load mood data from localStorage
    let moodData = JSON.parse(localStorage.getItem('mood_data') || '[]');
    
    // DOM elements
    const moodButtons = document.querySelectorAll('.mood-btn');
    const moodNotes = document.getElementById('mood-notes');
    const saveMoodBtn = document.getElementById('save-mood-btn');
    const weeklyChart = document.getElementById('weekly-chart');
    const moodDistribution = document.getElementById('mood-distribution');
    const moodHistory = document.getElementById('mood-history');
    
    // Selected mood
    let selectedMood = null;
    
    // Mood labels
    const moodLabels = {
        1: { label: 'Awful', color: 'red' },
        2: { label: 'Bad', color: 'orange' },
        3: { label: 'Okay', color: 'yellow' },
        4: { label: 'Good', color: 'green' },
        5: { label: 'Great', color: 'blue' }
    };
    
    // Select mood
    moodButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            moodButtons.forEach(btn => btn.classList.remove('ring-2', 'ring-offset-2', 'ring-blue-500'));
            
            // Add active class to clicked button
            this.classList.add('ring-2', 'ring-offset-2', 'ring-blue-500');
            
            // Set selected mood
            selectedMood = parseInt(this.getAttribute('data-mood'));
        });
    });
    
    // Save mood
    saveMoodBtn.addEventListener('click', function() {
        if (selectedMood === null) {
            alert('Please select a mood first!');
            return;
        }
        
        const notes = moodNotes.value.trim();
        const today = new Date().toISOString().split('T')[0];
        
        // Check if mood for today already exists
        const existingIndex = moodData.findIndex(mood => mood.date === today);
        
        if (existingIndex !== -1) {
            // Update existing mood entry
            moodData[existingIndex].mood = selectedMood;
            moodData[existingIndex].notes = notes;
            moodData[existingIndex].updated_at = Date.now();
        } else {
            // Create new mood entry
            const newMood = {
                id: generateId(),
                date: today,
                mood: selectedMood,
                notes: notes,
                created_at: Date.now()
            };
            moodData.push(newMood);
        }
        
        // Save to localStorage
        localStorage.setItem('mood_data', JSON.stringify(moodData));
        
        // Reset form
        selectedMood = null;
        moodNotes.value = '';
        moodButtons.forEach(btn => btn.classList.remove('ring-2', 'ring-offset-2', 'ring-blue-500'));
        
        // Refresh displays
        displayWeeklyChart();
        displayMoodDistribution();
        displayMoodHistory();
    });
    
    // Display weekly chart
    function displayWeeklyChart() {
        weeklyChart.innerHTML = '';
        
        if (moodData.length === 0) {
            weeklyChart.innerHTML = '<p class="text-gray-500 dark:text-gray-400 text-center w-full py-16">No mood data yet</p>';
            return;
        }
        
        // Get last 7 days
        const today = new Date();
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            last7Days.push(date.toISOString().split('T')[0]);
        }
        
        // Create bars for each day
        last7Days.forEach(day => {
            const dayData = moodData.find(mood => mood.date === day);
            const barContainer = document.createElement('div');
            barContainer.className = 'flex flex-col items-center flex-1 px-1';
            
            const dayLabel = document.createElement('div');
            dayLabel.className = 'text-xs text-gray-500 dark:text-gray-400 mt-2';
            dayLabel.textContent = new Date(day).toLocaleDateString('en-US', { weekday: 'short' });
            
            const bar = document.createElement('div');
            bar.className = 'w-full flex justify-center mt-2';
            
            if (dayData) {
                const barValue = document.createElement('div');
                barValue.className = `w-6 bg-${moodLabels[dayData.mood].color}-500 rounded-t hover:bg-${moodLabels[dayData.mood].color}-600 transition-all`;
                barValue.style.height = `${dayData.mood * 20}%`;
                bar.appendChild(barValue);
            } else {
                const emptyBar = document.createElement('div');
                emptyBar.className = 'w-6 bg-gray-200 dark:bg-gray-700 rounded-t';
                emptyBar.style.height = '4px';
                bar.appendChild(emptyBar);
            }
            
            barContainer.appendChild(bar);
            barContainer.appendChild(dayLabel);
            weeklyChart.appendChild(barContainer);
        });
    }
    
    // Display mood distribution
    function displayMoodDistribution() {
        moodDistribution.innerHTML = '';
        
        if (moodData.length === 0) {
            moodDistribution.innerHTML = '<p class="text-gray-500 dark:text-gray-400 text-center py-16">No mood data yet</p>';
            return;
        }
        
        // Count moods
        const moodCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        moodData.forEach(mood => {
            moodCounts[mood.mood]++;
        });
        
        // Total moods
        const totalMoods = moodData.length;
        
        // Display distribution
        for (let i = 5; i >= 1; i--) {
            const percentage = totalMoods > 0 ? (moodCounts[i] / totalMoods) * 100 : 0;
            const distributionElement = document.createElement('div');
            distributionElement.className = 'flex items-center';
            distributionElement.innerHTML = `
                <div class="w-24 text-gray-700 dark:text-gray-300">${moodLabels[i].label}</div>
                <div class="flex-1 ml-2">
                    <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div class="bg-${moodLabels[i].color}-500 h-2.5 rounded-full" style="width: ${percentage}%"></div>
                    </div>
                </div>
                <div class="w-12 text-right text-gray-700 dark:text-gray-300">${moodCounts[i]}</div>
            `;
            moodDistribution.appendChild(distributionElement);
        }
    }
    
    // Display mood history
    function displayMoodHistory() {
        moodHistory.innerHTML = '';
        
        if (moodData.length === 0) {
            moodHistory.innerHTML = '<p class="text-gray-500 dark:text-gray-400 text-center py-8">No mood history yet</p>';
            return;
        }
        
        // Sort by date descending
        const sortedMoodData = [...moodData].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Display last 10 entries
        const recentMoodData = sortedMoodData.slice(0, 10);
        
        recentMoodData.forEach(mood => {
            const historyElement = document.createElement('div');
            historyElement.className = 'flex items-center p-4 rounded-lg bg-gray-50 dark:bg-gray-700';
            historyElement.innerHTML = `
                <div class="mr-4">
                    <i class="fas fa-${getMoodIcon(mood.mood)} text-2xl text-${moodLabels[mood.mood].color}-500"></i>
                </div>
                <div class="flex-1">
                    <h3 class="font-medium text-gray-800 dark:text-white">${moodLabels[mood.mood].label}</h3>
                    <p class="text-gray-600 dark:text-gray-400 text-sm">${new Date(mood.date).toLocaleDateString()}</p>
                    ${mood.notes ? `<p class="text-gray-600 dark:text-gray-400 text-sm mt-1">${mood.notes}</p>` : ''}
                </div>
            `;
            moodHistory.appendChild(historyElement);
        });
    }
    
    // Get mood icon
    function getMoodIcon(mood) {
        switch (mood) {
            case 1: return 'angry';
            case 2: return 'frown';
            case 3: return 'meh';
            case 4: return 'smile';
            case 5: return 'laugh';
            default: return 'meh';
        }
    }
    
    // Generate unique ID
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    // Initial display
    displayWeeklyChart();
    displayMoodDistribution();
    displayMoodHistory();
});
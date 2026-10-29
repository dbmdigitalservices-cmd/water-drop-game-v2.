# charity: water Water Drop Game

A small browser game built with separate HTML, CSS, and JavaScript files. Catch blue drops for +1 point and avoid red drops, which subtract 2 points. The score cannot go below zero.

## Controls and goals

- Select Easy (12 points), Normal (20 points), or Hard (28 points). Every round lasts 30 seconds; Normal is selected by default.
- Select **Start Game**, then click or tap the falling drops. The goal is evaluated only when time expires. Start again after a result to replay, or use **Reset** at any time.
- Catch the yellow water can, which appears every five seconds and adds 2 points.
- The difficulty selector is locked during a round. The selected mode and target remain visible throughout.
- Milestone messages appear at 25%, 50%, 75%, and 100% of the selected target, once per round.

## Project 6 LevelUps

- **Score milestones:** Messages are calculated from the selected target and shown in their own accessible status area.
- **Sound effects:** The Sound On/Off checkbox is enabled by default. The collection sound plays when a clean drop is caught; the win sound plays when the round ends with the selected target reached. Reset and turning sound off stop and rewind both tracks. Playback failures do not interrupt gameplay.

## Audio sources and attribution

The game uses `cartoon_music-puzzle-game-correct-answer-508718.mp3` for clean drops, `lesiakower-error-mistake-sound-effect-incorrect-answer-437420.mp3` for dirty drops, and `freesound_community-game-over-arcade-6435.mp3` for wins. Source-page URLs, creators, and license/attribution terms are not recorded in the available project files; verify and add those details before redistribution if required. Gameplay points are symbolic and do not represent actual donations or water delivered.

## Run and deploy

Open `index.html` in a browser to play locally. The project has no build step or external runtime dependencies. To deploy on GitHub Pages, publish the repository (or its selected source folder) in Pages settings; keep `index.html`, `styles.css`, `script.js`, all three MP3 files, and the `img/` directory together. All project asset references are relative, so they also work from a repository subdirectory.

## Mission

charity: water works to bring clean and safe water to communities. Gameplay points are symbolic only and do not represent donations or water delivered. Learn more at [charitywater.org](https://www.charitywater.org/) or visit its [official donation page](https://www.charitywater.org/donate).
In this game, users collect as many falling water drops as possible. Users tap to collect drops before they hit the ground. You’ll be working from a partially built version of the game. Some functionality is already provided, and your job is to complete the rest.

## What’s Already Done

The starter files already include:

- A **heading and tagline**
- A **start button**
- A **game container** where water drops appear
- A **placeholder timer and score** (not functional yet)
- A **logo image** from charity: water
- Working code that:
  - Starts the game when the start button is clicked
  - Makes water drops fall randomly at different sizes

## What You Need to Add

Here’s what you're required to implement to bring the game to life:

### Game Functionality

- **Update the score**
  - +1 point for each drop clicked  

- **Add a 30-second timer**
  - When the timer reaches 0, the game ends  

- **Display a message when the game ends**
  - If the player scores **20 or more points**, show a **winning** message  
  - If the player scores **less than 20 points**, show a **"try again"** message  
  - Create one array of possible winning messages and one array of losing messages
  - Depending on whether the user wins or loses, randomly pick and display a message from the appropriate array

### Visual Styling

- **Add charity: water branding**
  
  - Use the provided logo  
  - Use the [charity: water brand guidelines](https://drive.google.com/file/d/1ct4zYRIwHAtxoNQoeaVwWYPdnruSC6sr/view) to stay on-brand with colors and styling
  - Add styling rules to ensure your game layout adjusts well across different screen sizes


These are the minimum requirements, but if you'd like an additional challenge go ahead and give the LevelUps a shot! For example, you can set up logic to make some of the drops "bad" drops that remove points if the user click them, complete with a different color to distinguish them from "good" drops. Have fun and make the game your own!

If you have any questions or need any assistance with your code, reach out to the HelpHub or attend a Drop-In Hour. You got this!!

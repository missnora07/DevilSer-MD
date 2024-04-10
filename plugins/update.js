const { pnix, mode} = require("../lib");
const https = require('https');
const { exec } = require('child_process');

pnix({
    pattern: "updt",
    type: "main",
    desc: "Update to latest version",
    fromMe: true
}, async(msg) => {
// Function to fetch the latest commit SHA from GitHub
function fetchLatestCommitSha(repoOwner, repoName) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.github.com',
            path: `/repos/${repoOwner}/${repoName}/commits/master`,
            headers: {
                'User-Agent': 'nodejs',
                'Accept': 'application/vnd.github.v3+json'
            }
        };

        https.get(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                const commit = JSON.parse(data);
                resolve(commit.sha);
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}

// Function to execute a git pull command
function gitPull() {
    return new Promise((resolve, reject) => {
        exec('git pull', (error, stdout, stderr) => {
            if (error) {
                reject(error);
            }
            resolve(stdout ? stdout : stderr);
        });
    });
}

// Example usage
async function updateApp(repoOwner, repoName) {
    try {
        const latestCommitSha = await fetchLatestCommitSha(repoOwner, repoName);
        console.log('Latest Commit SHA:', latestCommitSha);
        const result = await gitPull();
        console.log('Git Pull Result:', result);
        await msg.reply('App updated successfully!');
    } catch (error) {
        console.error('Error updating app:', error);
    }
}

// Call updateApp function with your GitHub repository owner and name
updateApp('darlsoul', 'DevilSer-MD');
        await msg.reply(`Bot may restart`);
});

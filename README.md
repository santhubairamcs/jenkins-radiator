# Jenkins Radiator

An SPA (Single Page App) implemented with backbone.js that monitors your Jenkins CI build server and displays a radiator of failing,
passing, building, aborted, unstable and disabled jobs. Audio is played when jobs move from a passing state to a failing state
or from a failing state to a passing state.

Supports configuring multiple radiators for showing different jobs.

# Installation

1. Download a [zip of the project](https://github.com/svo/jenkins-radiator/archive/master.zip)
2. Extract that zip
3. Open `index.html` in a browser

You will need to configure the radiator (See below for instructions).

## Configuration

1. Edit `config.js`
 * `ci_json_url`: URL of Jenkins instance
 * `refresh_interval`: refresh rate in milliseconds
 * `radiatorTitle`: title
 * `excludeFilter`: jobs to exclude
 * `includeFilter`: jobs to include

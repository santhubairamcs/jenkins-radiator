var configs = [
    {
        ci_json_url:"http://localhost:8081/jenkins/",
        refresh_interval: 24000,
        radiatorTitle: 'Sample 1',
        excludeFilter: [],
        includeFilter: ["build1","build2"]
    },
    {
        ci_json_url:"http://localhost:8081/jenkins/",
        refresh_interval: 24000,
        radiatorTitle: 'Sample 2',
        excludeFilter: [],
        includeFilter: ["build3","build4"]
    }
];

var config = configs[0];

var loggingConfig = {
    debug: false,
    info: true
}

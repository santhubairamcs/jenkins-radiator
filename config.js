var configs = [
    {
        ci_json_url:"http://localhost:8080/",
        refresh_interval: 24000,
        radiatorTitle: 'Sample 1',
        excludeFilter: [],
        includeFilter: ["build1","build2"]
    },
    {
        ci_json_url:"http://localhost:8080/",
        refresh_interval: 24000,
        radiatorTitle: 'Sample 2',
        excludeFilter: [],
        includeFilter: [],
        dynamicIncludeFilter: true,
        dynamicIncludeFilterUrl: "http://localhost:8081/radiator.xml"
    }
];

function getConfigFor(config) {
    config.includeFilter = [];
    $.get(config.dynamicIncludeFilterUrl, function (data) {
        $(data).find("entry").each(function () {
            var jobName = $(this).find("title").text().split(" ")[0];
            config.includeFilter.push(jobName);
        });
    });
}

configs.forEach(function(entry) {
    if (entry.dynamicIncludeFilter === true) {
        getConfigFor(entry);
    }
});

var config = configs[0];

var loggingConfig = {
    debug: false,
    info: true
}

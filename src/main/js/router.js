function getConfigFor(config) {
    while (config.includeFilter.length) {
        config.includeFilter.pop();
    }

    $.ajax({
        type: 'GET',
        url: config.dynamicIncludeFilterUrl+"/api/json?jsonp=?",
        dataType: 'jsonp',
        success: function(data) {
            $.each($(data.jobs), function(idx, obj) {
                config.includeFilter.push(obj.name);
            });
        }
    });
}

function loadConfig() {
    configs.forEach(function(entry) {
        if (entry.dynamicIncludeFilter === true) {
            getConfigFor(entry);
        }
    });
}

JR.AppRouter = Backbone.Router.extend({
    routes: {
        "":                     "help",
        "help":                 "help",
        "builds/:configIdx":    "builds",  // #builds/0
        "radiator/:configIdx":  "radiator"  // #radiator/0
    },
    timers: [],

    clearAppUI: function(){
        loadConfig();

        // Revert to default background color
        $('body').css("background-color", 'white');
        // Clear the container
        $('#container').html("");
        // Hide these unless explicitly wanted
        $('#footer').hide();
        $('#title').hide();

        _.each(this.timers, function(timer){
            window.clearInterval(timer);
        }, this);
        this.timers = [];
    },
    builds: function(configIdx){
        this.clearAppUI();

        this.selectConfig(configIdx);
        var titleView = new JR.RadiatorTitleView({model: config});

        var model = new JR.BuildServer();
        var buildServerView = new JR.BuildServerView({model: model});
        titleView.trigger('loading');
        model.fetch({success: function(model, response){
            if(LOG.isDebugEnabled()){
                LOG.debug("Fetched build server model");
            }
            //radiator.trigger("change:buildServer");
            buildServerView.render();
            titleView.trigger('loaded');
        }, error: function(model, response){
            LOG.error("Fetching build server model failed, radiator view not rendered. Model: " + JSON.stringify(model) + ", response: " + JSON.stringify(response));
        }});
    },
    help: function(){
        this.clearAppUI();

        if(LOG.isDebugEnabled()){
            LOG.debug("Rendering help view");
        }
        var helpView = new JR.HelpView({el: $('#container'), configs:configs});
        helpView.render();
    },
    radiator:function(configIdx){
        this.clearAppUI();

        this.selectConfig(configIdx);
        if(LOG.isDebugEnabled()){
            LOG.debug("Using config: " + JSON.stringify(config));
        }
        var titleView = new JR.RadiatorTitleView({model: config});
        $('#title').show();

        var buildServer = new JR.BuildServer();

        var radiator = new JR.Radiator({
            "buildServer": buildServer,
            "includeFilter":config.includeFilter,
            "excludeFilter":config.excludeFilter
        });
        if(LOG.isDebugEnabled()){
            LOG.debug("Radiator model created");
        }

        var radiatorView = new JR.RadiatorView({el: $('#container'), model: radiator});
        $('#footer').show();

        var fetchAndRender =  function(){
            titleView.trigger('loading');
            buildServer.fetch({success: function(model, response){
                if(LOG.isDebugEnabled()){
                    LOG.debug("Fetched build server model");
                }
                radiator.set('buildServer', buildServer);
                if(LOG.isDebugEnabled()){
                    LOG.debug("Triggering change of radiator model");
                }
                titleView.trigger('loaded');
                radiator.trigger('change');
            }, error: function(model, response){
                LOG.error("Fetching build server model failed, radiator view not rendered. Model: " + JSON.stringify(model) + ", response: " + JSON.stringify(response));
            }});
        };
        if(LOG.isDebugEnabled()){
            LOG.debug("Refreshing every " + config.refresh_interval/1000 + " seconds as specified by config.refresh_interval");
        }
        fetchAndRender();
        this.timers.push(setInterval(fetchAndRender, config.refresh_interval));
    },
    selectConfig: function(configIdx){
        var idx=parseInt(configIdx, 10);
        if(idx){
            if(idx>=configs.length){
                idx=0;
            }else if(idx<0){
                idx=0;
            }
            config = configs[idx];
        }
    }
});
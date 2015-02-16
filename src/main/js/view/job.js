JR.JobView = Backbone.View.extend({
    // TODO: This is a "Job state view, displaying only the name & color indicating state"
    className:"row-fluid job-view",

    initialize: function(){
        _.bindAll(this, 'render');
    },

    render: function(){
        var template = "<div class='span12'><span style=\"width:100%\"><a href=\"{{url}}\"><h1>{{name}}</h1></a></span></div>";
        var json = this.model.toJSON();
        if(LOG.isTraceEnabled()){
            LOG.trace("Model as json: " + JSON.stringify(json));
        }
        var output = Mustache.to_html(template, json);
        $(this.el).html(output);
        $(this.el).addClass(this.model.get("color"));
        return this;
    }
});
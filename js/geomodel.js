;
(function(m) {

    "use strict";
    // var self = this;
    // var WeatherRouter = Backbone.Router.extend {(
    //     routes: {
    //         "current" : "drawDetails"
    //         "week" : "drawNextWeek"
    //         "*default" : "drawHome"
    //     },
    //     drawDetails: function () {
    //         self.drawDetailsInfo();
    //     },
    //     drawNextWeek: function () {
    //         self.drawNextWeekInfo();
    //     },
    //     drawHome: function () {
    //         self.drawHomeInfo
    //     },
    //     initialize: function () {
    //         Backbone.history.start ();
    //     }
    //     )};
    // var router = new WeatherRouter();

    Backbone.GeoModel = Backbone.Model.extend({
        geo: function() {
            var x = $.Deferred(),
                self = this;

            navigator.geolocation.getCurrentPosition(

                function(position) {
                    self.set('position', position) //took out , {silent: true}
                    x.resolve(position);
                },

                function(e) {
                    x.fail(e)
                },

                {
                    timeout: 12000, //12s
                    maximumAge: 10 * 60 * 1000 //600s, or 10m
                })

            return x;
        },
        geofetch: function() {
            var self = this;
            return this.geo().then(function(position) {
                return self.fetch()
            })
        }
    });

    var GeoWeatherModel = Backbone.GeoModel.extend({
        url: function() {
            return [
                "https://api.forecast.io/forecast/",
                this.get('access_token'),
                "/",
                this.get("position").coords.latitude + ',' + this.get("position").coords.longitude,
                "?callback=?"
            ].join('')
        },
        defaults: {},
        validate: function() {

        },
        initialize: function() {}
    });

    // var HomeView = Backbone.View.extend({
    //     el: 'body',
    //     events: {
    //         "click .main-view": "showDetails"
    //     },

    //     showDetails: function(){
    //         console.log("Details");
    //         document.querySelector(".main-view").innerHTML = "click for weather details";
    //     },

    //     render: function(){
    //         var weatherdetails = new WeatherView();
    //         this.$el.append(weatherdetails.el);

    //     },

    //     initialize: function(){
    //         this.render()
    //     }

    // });
    var HomeView = Backbone.View.extend({
        cache: {},
        stream: function(url) {
            var x = $.Deferred();
            if (this.cache[url]) {
                x.resolve(cache[url]);
            } else {
                $.get(url).then((function(d) {
                    this.cache[url] = _.template(d);
                    x.resolve(_.template(d));
                }).bind(this));
            }
            return x;
        },
        loadTemplate: function(name) {
            return this.stream('./templates/' + name + '.html');
        },
        initialize: function(options) {
            this.options = options;
            this.model && this.model.on("change", this.render.bind(this));
        },
        render: function() {
            var self = this;
            this.loadTemplate(this.options.view || this.view).then(function(fn) {
                self.model && (self.el.innerHTML = fn(self.model.toJSON()));
            })
        }
    });

    var WeatherView = Backbone.View.extend({

        // el: 'body',
        // tagName: 'div',
        // className: 'main-view',
        el: ".main-view",
        loadTemplate: function(name) {
            return $.get("./templates/" + name + ".html")
        },

        render: function() {
                var self = this;
                this.loadTemplate("weather").then(function(html) {
                    var templatingFn = _.template(html)
                        // self.el.innerHTML = templatingFn(self.model.toJSON());
                    self.el.innerHTML = templatingFn(self.model.toJSON());
                })
            }
            // initialize: function () {
            // console.log("weather details should be up")
            // this.model = new GeoWeatherModel();
            // }
    });

    var m = new GeoWeatherModel({
        access_token: "031a3972cc6466ee4d259c27d48ad1cf"
    });

    var v = new WeatherView({
        model: m
    });

    m.geofetch().then(function(data) {
        console.log(data);
        v.render();
    });



    //---------------------------------------
    // exports.geofetch().then(function() { //template out to the DOM}) = Person;

})(typeof module === "object" ? module.exports : window);

// access_token: "031a3972cc6466ee4d259c27d48ad1cf"

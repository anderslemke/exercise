$(document).ready(function () {
    function loader() {
        this.files = [];
        this.loadedCnt = 0;
        this.callback = function () {};
        this.image = function (e) {
            var t = new Image;
            t.src = e;
            t.onload = this.loaded();
            this.files.push(t);
            return t
        };
        this.sound = function (e) {
            var t = new Audio(e);
            t.addEventListener("canplaythrough", this.loaded(), !1);
            t.load();
            this.files.push(t);
            return t
        };
        this.load = function (e) {
            this.callback = e;
            this.loaded()
        };
        this.loaded = function () {
            this.loadedCnt++;
            this.loadedCnt >= this.files.length - 1 && this.callback && this.callback()
        }
    }

    function countdown() {
        var t, n, r;
        ga("send", "event", "general", "click", "button", !0);
        ga("send", "event", "general", "select", "duration", e.duration);
        t = e.countdown.time;
        $(".title-elements").slideUp();
        n = $(".start-button");
        n.html(t);
        r = window.setInterval(function () {
            if (t > 0) {
                t--;
                n.text(t)
            } else {
                n.hide();
                $(".app").fadeIn(500);
                for (i in e.exe) $("#balls.row-fluid").append("<div class='span1 ball' id='ball" + i + "'><img src='images/ball.png' /></div>");
                clearInterval(r);
                ex()
            }
        }, 1e3)
    }

    function ex() {
        var t, n, r, i;
        e.sounds.tick.play();
        if (e.current + 1 > e.exe.length) {
            $("#timer").text(e.finished.name);
            $("#picture").hide();
            $("#activity").hide();
            $("#balls").hide();
            return !0
        }
        t = Math.round((e.duration - e.rest.time * e.exe.length) / e.exe.length);
        n = Math.round(t / e.exe[e.current].split);
        r = e.rest.time;
        $("#picture").attr("src", "images/" + e.exe[e.current].slug + ".png");
        $("#timer .nums").text(t);
        $("#activity").text(e.exe[e.current].name);
        i = window.setInterval(function () {
            if (t > 1) {
                t--;
                e.sounds.tick.play();
                t == n + 1 && e.sounds.swit.play();
                $("#timer .nums").text(t)
            } else if (r > 1) {
                r--;
                r == 9 && e.sounds.done.play();
                $("#ball" + (e.current - 1)).addClass("ball-fade");
                $("body, #timer, #image").removeClass("go").addClass("rest");
                $("#timer .nums").text(r);
                $("#activity").text(e.rest.name);
                $("#picture").hide();
                $("#next").text("(" + e.exe[e.current].name + ")").fadeIn()
            } else {
                clearInterval(i);
                ga("send", "section", "sections", "complete", "section-" + e.current, 1);
                $("#picture").show();
                $("#next").fadeOut();
                $("body, #timer, #image").removeClass("rest").addClass("go");
                ex()
            }
        }, 1e3);
        e.current++
    }
    var e;
    $(".app").hide().removeClass("hidden");
    e = {
        duration: 480,
        countdown: {
            time: 3
        },
        rest: {
            name: "Rest",
            time: 10
        },
        finished: {
            name: "DONE"
        },
        current: 0,
        sounds: {
            tick: "tick.wav",
            done: "done.wav",
            swit: "switch.wav",
            comp: "completed.wav"
        },
        exe: [{
                name: "Jumping Jacks",
                slug: "jumping-jack"
            }, {
                name: "Wall Sit",
                slug: "wall-sit"
            }, {
                name: "Push-Up",
                slug: "push-up"
            }, {
                name: "Abdominal Crunch",
                slug: "crunch"
            }, {
                name: "Step-Up onto Chair",
                split: 2,
                slug: "step-up"
            }, {
                name: "Squat",
                slug: "squat"
            }, {
                name: "Triceps Dip on Chair",
                slug: "triceps-dip"
            }, {
                name: "Plank",
                slug: "plank"
            }, {
                name: "High Knees Running",
                slug: "running"
            }, {
                name: "Lunge",
                split: 2,
                slug: "lunge"
            }, {
                name: "Push-up and Rotation",
                split: 2,
                slug: "push-up-rotate"
            }, {
                name: "Side Plank",
                split: 2,
                slug: "side-plank"
            }
        ]
    };
    $(".duration").focus(function () {
        e.duration = $(this).val("");
        ga("send", "event", "general", "focus", "duration", !0)
    });
    $(".duration").keyup(function () {
        $(this).val() > 1 ? e.duration = $(this).val() * 60 : e.duration = ($(this).val() + 3) * 60;
        ga("send", "event", "general", "change", "duration", !0);
        ga("send", "event", "general", "change", "duration to", e.duration)
    });
    $(".start").click(function () {
        e.loader = new loader;
        for (files in e.exe) e.exe[files].image = e.loader.image("images/" + e.exe[files].slug + ".png");
        for (sound in e.sounds) e.sounds[sound] = e.loader.sound("sounds/" + e.sounds[sound]);
        e.loader.load(function () {
            countdown()
        });
        return !1
    })
});
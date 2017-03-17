export default class {
    flagTopReachBottom = false;
    flagBottomReachTop = false;

    offsetTopEnterBottom = 0;
    offsetTopLeaveBottom = 0;
    offsetBottomReachTop = 0;

    onTopEnterBottom = function() {};
    onTopLeaveBottom = function() {};
    onBottomEnterTop = function() {};
    onBottomLeaveTop = function() {};

    constructor(options) {
        for(const key in options) {
            this[key] = options[key];
        }

        window.addEventListener('scroll', this.entranceHandler.bind(this));
        window.addEventListener('resize', this.entranceHandler.bind(this));
    }

    entranceHandler() {
        const innerHeight = window.innerHeight;
        const rect = this.el.getBoundingClientRect();

        this.adjustElTopScreenBottom(innerHeight, rect);
        this.adjustElBottomScreenTop(innerHeight, rect);
    }

    adjustElTopScreenBottom(innerHeight, rect) {
        const flagTopHigherThanBottom = (rect.top + this.offsetTopEnterBottom) <= innerHeight;
        const flagTopLowerThanBottom = (rect.top + this.offsetTopLeaveBottom) > innerHeight;

        // top enter bottom
        if(flagTopHigherThanBottom && !this.flagTopReachBottom) {
            this.flagTopReachBottom = true;
            this.onTopEnterBottom.call(this.el);
        }

        // top leave bottom
        if(flagTopLowerThanBottom && this.flagTopReachBottom) {
            this.flagTopReachBottom = false;
            this.onTopLeaveBottom.call(this.el);
        }
    }

    adjustElBottomScreenTop(innerHeight, rect) {
        const flagBottomHigherThanTop = (rect.bottom + this.offsetBottomReachTop) < 0;
        const flagBottomLowerThanTop = (rect.bottom + this.offsetBottomReachTop) >= 0;

        // bottom leave top
        if(flagBottomHigherThanTop && !this.flagBottomReachTop) {
            this.flagBottomReachTop = true;
            this.onBottomLeaveTop.call(this.el);
        }

        // bottom enter top
        if(flagBottomLowerThanTop && this.flagBottomReachTop) {
            this.flagBottomReachTop = false;
            this.onBottomEnterTop.call(this.el);
        }
    }
}

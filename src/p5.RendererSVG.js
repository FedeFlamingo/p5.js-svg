var SVGCanvas = require('svgcanvas');

module.exports = function(p5) {
    function RendererSVG(elt, pInst, isMainCanvas) {
        var svgCanvas = new SVGCanvas();
        var svg = svgCanvas.svg;

        // replace <canvas> with <svg> and copy id, className
        var parent = elt.parentNode;
        var id = elt.id;
        var className = elt.className;
        parent.replaceChild(svgCanvas.getElement(), elt);
        svgCanvas.id = id;
        svgCanvas.className = className;
        elt = svgCanvas; // our fake <canvas>

        elt.parentNode = {
            // fake parentNode.removeChild so that noCanvas will work
            removeChild: function(element) {
                if (element === elt) {
                    var wrapper = svgCanvas.getElement();
                    wrapper.parentNode.removeChild(wrapper);
                }
            }
        };

        p5.Renderer2D.call(this, elt, pInst, isMainCanvas);

        this.isSVG = true;
        this.svg = svg;

        return this;
    }

    RendererSVG.prototype = Object.create(p5.Renderer2D.prototype);

    RendererSVG.prototype.resize = function(w, h) {
        // Canvas should be cleared when resize called
        // http://p5js.org/reference/#p5/resizeCanvas
        this.clear();
        p5.Renderer2D.prototype.resize.call(this, w, h);
    };

    p5.RendererSVG = RendererSVG;
};



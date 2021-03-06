/*
    jQuery Number Validation Plugin v1.0.1
    copyright: Alexander Perucci
    site: alexanderperucci.com
    license: Mozilla Public License Version 2.0
*/

(function ($) {
    function getParameters(options, bordercolorok) {
        bordercolorok = (bordercolorok == "rgb(0, 0, 0)") ? "" : bordercolorok;
        var defaultParameters = {
            rules: {
                type: 'integer',
                required: false,
                maxvalue: undefined,
                minvalue: undefined,
                decimals: undefined,
                length: undefined
            },
            messages: {
                type: "",
                required: "",
                maxvalue: "",
                minvalue: "",
                decimals: "",
                length: ""
            },
            settingserror: {
                setting:true,
                tooltipplacement: "bottom",
                tooltiptrigger: "hover",
                bordercolorok: bordercolorok,
                bordercolornotok: "red"
            }
        };
        return $.extend(true, defaultParameters, options);
    }

    function setInputOk(e, destroy, parameters) {
        if(parameters.settingserror.setting){
            if (destroy) {
                e.css("border-color", parameters.settingserror.bordercolorok);
                e.tooltip('destroy');
            }
        }
    }

    function setInputNotOk(e, message, parameters) {
        if(parameters.settingserror.setting){    
            e.css("border-color", parameters.settingserror.bordercolornotok);
            e.tooltip('destroy');
            e.tooltip({
                placement: parameters.settingserror.tooltipplacement,
                trigger: parameters.settingserror.tooltiptrigger,
                title: message
            });
        }    
    }

    function isCorrectRequired(required, value) {
        if (required != undefined) {
            if (required && value == "") {
                return false;
            } else {
                return true;
            }
        }
        return true;
    }

    function isCorrectLength(length, value) {
        if (length != undefined) {
            var value = value.replace("-", "").split(".")[0];
            if (value.length > length) {
                return false;
            } else {
                return true;
            }
        }
        return true;
    }

    function isCorrectDecimals(decimals, value) {
        if (decimals != undefined) {
            var valueDecimal = value.split(".")[1];
            if (valueDecimal != undefined && valueDecimal.length <= decimals) {
                return true;
            } else {
                return false;
            }
        }
        return true;
    }


    function isCorrectMaxValue(maxvalue, value) {
        if (maxvalue != undefined) {
            if (value == "")
                return true;
            if (parseFloat(value) <= parseFloat(maxvalue)) {
                return true;
            } else {
                return false;
            }
        }
        return true;
    }

    function isCorrectMinValue(minvalue, value) {
        if (minvalue != undefined) {
            if (value == "")
                return true;
            if (parseFloat(value) >= parseFloat(minvalue)) {
                return true;
            } else {

                return false;
            }
        }
        return true;
    }

    function validateInteger(value, parameters) {
        var required = parameters.rules.required;
        var maxvalue = parameters.rules.maxvalue;
        var minvalue = parameters.rules.minvalue;
        var length = parameters.rules.length;

        //check required
        if (!isCorrectRequired(required, value)) {
            return {
                valid: false,
                message: parameters.messages.required
            };
        }
        if (value == undefined || value == "") {
            return {
                valid: true
            };
        }

        //check integer
        var intExpr = new RegExp('^[-]?(0|[1-9][0-9]*)$');
        if (!intExpr.test(value)) {
            return {
                valid: false,
                message: parameters.messages.type
            };
        }

        //check length
        if (!isCorrectLength(length, value)) {
            return {
                valid: false,
                message: parameters.messages.length
            };
        }

        //check maxvalue
        if (!isCorrectMaxValue(maxvalue, value)) {
            return {
                valid: false,
                message: parameters.messages.maxvalue
            };
        }

        //check minvalue
        if (!isCorrectMinValue(minvalue, value)) {
            return {
                valid: false,
                message: parameters.messages.minvalue
            };
        }

        return {
            valid: true
        };
    }

    function validateDouble(value, parameters) {

        var required = parameters.rules.required;
        var decimals = parameters.rules.decimals;
        var maxvalue = parameters.rules.maxvalue;
        var minvalue = parameters.rules.minvalue;
        var length = parameters.rules.length;

        //check required   
        if (!isCorrectRequired(required, value)) {
            return {
                valid: false,
                message: parameters.messages.required
            };
        }
        if (value == undefined || value == "") {
            return {
                valid: true
            };
        }

        // check double
        var intExpr = new RegExp('^[-]?(0|[1-9][0-9]*)(\\.[0-9]+)?$');
        if (!intExpr.test(value)) {
            return {
                valid: false,
                message: parameters.messages.type
            };
        }

        //check decimals
        if (!isCorrectDecimals(decimals, value)) {
            return {
                valid: false,
                message: parameters.messages.decimals
            };
        }

        // check length integer
        if (!isCorrectLength(length, value)) {
            return {
                valid: false,
                message: parameters.messages.length
            };
        }

        //check maxvalue
        if (!isCorrectMaxValue(maxvalue, value)) {
            return {
                valid: false,
                message: parameters.messages.maxvalue
            };
        }

        //check minvalue
        if (!isCorrectMinValue(minvalue, value)) {
            return {
                valid: false,
                message: parameters.messages.minvalue
            };
        }

        return {
            valid: true
        };
    }


    $.fn.masknumber = function (options) {
        var parameters = getParameters(options, $(this).css("border-color"));

        //store parameters of the object
        $(this).data("NumberPlugin", parameters);

        return this.on("keyup", function (e) {
            e.preventDefault();
            var error;
            switch (true) {
            case /integer/.test(parameters.rules.type):
                error = validateInteger($(this).val(), parameters);
                break;
            case /double/.test(parameters.rules.type):
                error = validateDouble($(this).val(), parameters);
                break;
            default:
                break;
            }

            //set error or not
            (!error.valid) ? setInputNotOk($(this), error.message, parameters) : setInputOk($(this), true, parameters);

            $(this).focus();
        });


    };

    $.fn.validnumber = function (options) {
        var valid = true;
        for (var i = 0; i < this.length; i++) {
            var parameters;
            if (options == undefined || $.isEmptyObject(options)) {
                parameters = $(this[i]).data("NumberPlugin");
            } else {
                parameters = getParameters(options, $(this[i]).css("border-color"));
            }
            var error;
            switch (true) {
            case /integer/.test(parameters.rules.type):
                error = validateInteger($(this[i]).val(), parameters);
                break;
            case /double/.test(parameters.rules.type):
                error = validateDouble($(this[i]).val(), parameters);
                break;
            default:
                break;
            }

            //set error or not
            (!error.valid) ? setInputNotOk($(this[i]), error.message, parameters) : setInputOk($(this[i]), false, parameters);
            (!error.valid) ? valid = false : true;
        }

        return valid;
    };

})(jQuery);

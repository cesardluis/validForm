/**
 * validar formularios
 * @param  {jQuery} $
 * @param  {window} window
 * @return {[type]}
 */
(function($, window, undefined) {
    var formValid = function(elem, opciones) {
        this.$elem = $(elem);
        this.init(opciones);
    }
    formValid.prototype = {
        defaults : {
            MensajeMostrar: true,
            clasesValid: {
                vacio: '.vacio',
                email: '.email',
                numero: '.numero'
            }
        },
        init : function(opciones) {
            this.config = $.extend({}, this.defaults, opciones);
            this.campos = [];
            this.vacio();
            this.numero();
            this.email();

            this.$elem.css("position", "relative");
            this.$elem.append('<div class="vError" style="display:none" />');
            $('input[type=submit]', this.$elem).attr('disabled', 'disabled');

            var clas = this.config.clasesValid;
            var that = this;
            $(clas.vacio + ", " + clas.email + ", " + clas.numero, this.$elem).each(function(i, item){
                that.campos[$(item).attr('id')] = false;
            });
        },

        error: function(item, tipo){
            $(item).addClass('valid_error');
            $('input[type=submit]', this.$elem).attr('disabled', 'disabled');

            this.campos[$(item).attr("id")] = false;

            $(item).focusout(function(){
                $(".vError", this.$elem).css("display", "none");
            });

            if(this.config.MensajeMostrar){
                var pos = $(item).position();
                var h = $(item).outerHeight();
                var mensaje = $("#validMensajes ."+tipo, this.$elem).html();
                $(".vError", this.$elem).css({
                    "display": "block",
                    "top": (pos.top + h -1)+"px",
                    "left": pos.left+"px"
                }).html(mensaje);
            }
        },
        noError: function(item){
            $(item).removeClass('valid_error');
            this.campos[$(item).attr("id")] = true;
            this.validar();
            $(".vError", this.$elem).css("display", "none");
        },
        vacio: function (){
            var that= this,
                clas = this.config.clasesValid;
            $(clas.vacio, this.$elem).on("keypress keyup change focusout click focus", function(){
                var text = $(this).val();
                if($.trim(text) == "")
                    that.error(this,"novacio");
                else
                    that.noError(this);
            });
        },
        numero: function (){
            var that= this,
                clas = this.config.clasesValid;
            $(clas.numero, this.$elem).on("keypress keyup change focusout click focus", function(){
                var value = $.trim($(this).val());
                if( ! /^([0-9])*$/.test(value) || value == "")
                    that.error(this,"nonumero");
                else
                    that.noError(this);
            });
        },
        email: function (){
            var that= this,
                clas = this.config.clasesValid;
            $(clas.email, this.$elem).on("keypress keypress keyup change focusout click focus", function(){
                var text = $(this).val();
                if(/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test($.trim(text)))
                    that.noError(this);
                else
                    that.error(this,"noemail");
            });
        },
        validar: function(){
            var valid = true,
                valid2 = true,
                that = this,
                clas = this.config.clasesValid;
            $(clas.vacio + ", " + clas.email + ", " + clas.numero, this.$elem).each(function(i, item){
                var value = $.trim($(this).val());
                if(value.length == 0) valid = false;

                valid2 = valid2 && that.campos[$(item).attr('id')];
            });

            if(valid && valid2)
                $('input[type=submit]', this.$elem).removeAttr('disabled');
            else
                $('input[type=submit]', this.$elem).attr('disabled', 'disabled');
        }

    }
    $.fn.formvalid = function(opciones) {
        $.each(this, function(){
            if(typeof opciones == 'object' || !opciones)
                $(this).data('formvalid', new formValid(this, opciones));
            return this;
        });
    }
    window.formValid = formValid;
}) (jQuery, window);
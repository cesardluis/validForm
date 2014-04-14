(function($, window, undefined) {
    var formValid = function(elem, opciones) {
        this.$elem = $(elem);
        this.init(opciones);
    }
    formValid.prototype = {
        defaults : {
            MensajeMostrar: true,
            msgVacio: 'Este campo es requerido.',
            msgNumero: 'Este campo debe ser un numero valido.',
            msgEmail: 'Este campo ser un email valido.',
            clasesValid: {
                vacio: '.required',
                email: '.email',
                numero: '.numero'
            }
        },
        init : function(opciones) {
            this.config = $.extend({}, this.defaults, opciones);
            this.campos = [];

            this.$elem.css("position", "relative");
            this.$elem.append('<div class="vError" style="display:none" />');
            $('input[type=submit]', this.$elem).attr('disabled', 'disabled');

            var clas = this.config.clasesValid;
            var that = this;
            $(clas.vacio + ", " + clas.email + ", " + clas.numero, this.$elem).each(function(i, item){
                that.campos[$(item).attr('id')] = false;
            });

            this.vacio();
            this.numero();
            this.email();
            console.log(this.campos);
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
                var mensaje = ($(item).attr("error") && $(item).attr("error") != "") ? $(item).attr("error"):
                              ($("#validMensajes ."+tipo, this.$elem).length > 0) ? $("#validMensajes ."+tipo, this.$elem).html():
                              this.config[tipo];
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
            $(clas.vacio, this.$elem).each(function(){
                var text = $(this).val();
                if($.trim(text) != "")
                    that.campos[$(this).attr("id")] = true;
            });
            $(clas.vacio, this.$elem).on("keypress keyup change focusout click focus", function(){
                var text = $(this).val();
                if($.trim(text) == "")
                    that.error(this,"msgVacio");
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
                    that.error(this,"msgNumero");
                else{
                    b = true;
                    if ($(this).attr('max') !== undefined)
                        if(value > $(this).attr('max')) b = false;
                    if ($(this).attr('min') !== undefined)
                        if(value < $(this).attr('min')) b = false;

                    if(b) that.noError(this);
                    else that.error(this,"msgNumero");
                }
            });

             $(clas.numero, this.$elem).each(function(){
                var value = $.trim($(this).val());
                if(/^([0-9])*$/.test(value) && value != ""){
                    b = true;
                    if ($(this).attr('max') !== undefined)
                        if(value > $(this).attr('max')) b = false;
                    if ($(this).attr('min') !== undefined)
                        if(value < $(this).attr('min')) b = false;

                    if(b) that.campos[$(this).attr("id")] = true;
                }
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
                    that.error(this,"msgEmail");
            });

            $(clas.vacio, this.$elem).each(function(){
                var text = $(this).val();
                if(/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test($.trim(text)))
                    that.campos[$(this).attr("id")] = true;
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
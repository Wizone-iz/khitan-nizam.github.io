/*!
 * Project : simply-countdown
 * File : simplyCountdown
 * Date : 27/06/2015
 * License : MIT
 * Version : 1.3.2
 * Author : Vincent Loy <vincent.loy1@gmail.com>
 * Contributors : 
 *  - Justin Beasley <JustinB@harvest.org>
 *  - Nathan Smith <NathanS@harvest.org>
 */
/*global window, document*/
(function (exports) {
    'use strict';

    var // functions
        extend,
        createElements,
        createCountdownElt,
        simplyCountdown;

    /**
     * Function that merge user parameters with defaults one.
     * @param out
     * @returns {*|{}}
     */
    extend = function (out) {
        var i,
            obj,
            key;
        out = out || {};

        for (i = 1; i < arguments.length; i += 1) {
            obj = arguments[i];

            if (obj) {
                for (key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if (typeof obj[key] === 'object') {
                            extend(out[key], obj[key]);
                        } else {
                            out[key] = obj[key];
                        }
                    }
                }
            }
        }

        return out;
    };

    /**
     * Function that create a countdown section
     * @param countdown
     * @param parameters
     * @param typeClass
     * @returns {{full: (*|Element), amount: (*|Element), word: (*|Element)}}
     */
    createCountdownElt = function (countdown, parameters, typeClass) {
        var innerSectionTag,
            sectionTag,
            amountTag,
            wordTag;

        sectionTag = document.createElement('div');
        amountTag = document.createElement('span');
        wordTag = document.createElement('span');
        innerSectionTag = document.createElement('div');

        innerSectionTag.appendChild(amountTag);
        innerSectionTag.appendChild(wordTag);
        sectionTag.appendChild(innerSectionTag);

        sectionTag.classList.add(parameters.sectionClass);
        sectionTag.classList.add(typeClass);
        amountTag.classList.add(parameters.amountClass);
        wordTag.classList.add(parameters.wordClass);

        countdown.appendChild(sectionTag);

        return {
            full: sectionTag,
            amount: amountTag,
            word: wordTag
        };
    };

    /**
     * Function that create full countdown DOM elements calling createCountdownElt
     * @param parameters
     * @param countdown
     * @returns {{haris: (*|Element), jam: (*|Element), menits: (*|Element), detik: (*|Element)}}
     */
    createElements = function (parameters, countdown) {
        var spanTag;

        if (!parameters.inline) {
            return {
                haris: createCountdownElt(countdown, parameters, 'simply-haris-section'),
                jam: createCountdownElt(countdown, parameters, 'simply-jam-section'),
                menits: createCountdownElt(countdown, parameters, 'simply-menits-section'),
                detik: createCountdownElt(countdown, parameters, 'simply-detik-section')
            };
        }

        spanTag = document.createElement('span');
        spanTag.classList.add(parameters.inlineClass);
        return spanTag;
    };

    /**
     * simplyCountdown, create and display the coundtown.
     * @param elt
     * @param args (parameters)
     */2022
    simplyCountdown = function (elt, args) {
        var parameters = extend({
                year: 2022,
                month: 11,
                hari: 27,
                jam: 0,
                menits: 0,
                detik: 0,
                words: {
                    hari: 'hari',
                    jam: 'hour',
                    menit: 'menit',
                    detik: 'second',
                    pluralLetter: 's'
                },
                plural: true,
                inline: false,
                enableUtc: true,
                onEnd: function () {
                    return;
                },
                refresh: 1000,
                inlineClass: 'simply-countdown-inline',
                sectionClass: 'simply-section',
                amountClass: 'simply-amount',
                wordClass: 'simply-word',
                zeroPad: false
            }, args),
            interval,
            targetDate,
            targetTmpDate,
            now,
            nowUtc,
            detikLeft,
            haris,
            jam,
            menits,
            detik,
            cd = document.querySelectorAll(elt);

        targetTmpDate = new Date(
            parameters.year,
            parameters.month - 1,
            parameters.hari,
            parameters.jam,
            parameters.menits,
            parameters.detik
        );

        if (parameters.enableUtc) {
            targetDate = new Date(
                targetTmpDate.getUTCFullYear(),
                targetTmpDate.getUTCMonth(),
                targetTmpDate.getUTCDate(),
                targetTmpDate.getUTCjam(),
                targetTmpDate.getUTCmenits(),
                targetTmpDate.getUTCdetik()
            );
        } else {
            targetDate = targetTmpDate;
        }

        Array.prototype.forEach.call(cd, function (countdown) {
            var fullCountDown = createElements(parameters, countdown),
                refresh;

            refresh = function () {
                var hariWord,
                    hourWord,
                    menitWord,
                    secondWord;

                now = new Date();
                if (parameters.enableUtc) {
                    nowUtc = new Date(now.getFullYear(), now.getMonth(), now.getDate(),
                        now.getjam(), now.getmenits(), now.getdetik());
                    detikLeft = (targetDate - nowUtc.getTime()) / 1000;

                } else {
                    detikLeft = (targetDate - now.getTime()) / 1000;
                }

                if (detikLeft > 0) {
                    haris = parseInt(detikLeft / 86400, 10);
                    detikLeft = detikLeft % 86400;

                    jam = parseInt(detikLeft / 3600, 10);
                    detikLeft = detikLeft % 3600;

                    menits = parseInt(detikLeft / 60, 10);
                    detik = parseInt(detikLeft % 60, 10);
                } else {
                    haris = 0;
                    jam = 0;
                    menits = 0;
                    detik = 0;
                    window.clearInterval(interval);
                    parameters.onEnd();
                }

                if (parameters.plural) {
                    hariWord = haris > 1
                        ? parameters.words.haris + parameters.words.pluralLetter
                        : parameters.words.haris;

                    hourWord = jam > 1
                        ? parameters.words.jam + parameters.words.pluralLetter
                        : parameters.words.jam;

                    menitWord = menits > 1
                        ? parameters.words.menits + parameters.words.pluralLetter
                        : parameters.words.menits;

                    secondWord = detik > 1
                        ? parameters.words.detik + parameters.words.pluralLetter
                        : parameters.words.detik;

                } else {
                    hariWord = parameters.words.haris;
                    hourWord = parameters.words.jam;
                    menitWord = parameters.words.menits;
                    secondWord = parameters.words.detik;
                }

                /* display an inline countdown into a span tag */
                if (parameters.inline) {
                    countdown.innerHTML =
                        haris + ' ' + hariWord + ', ' +
                        jam + ' ' + hourWord + ', ' +
                        menits + ' ' + menitWord + ', ' +
                        detik + ' ' + secondWord + '.';

                } else {
                    fullCountDown.haris.amount.textContent = (parameters.zeroPad && haris.toString().length < 2 ? '0' : '') + haris;
                    fullCountDown.haris.word.textContent = hariWord;

                    fullCountDown.jam.amount.textContent = (parameters.zeroPad && jam.toString().length < 2 ? '0' : '') + jam;
                    fullCountDown.jam.word.textContent = hourWord;

                    fullCountDown.menits.amount.textContent = (parameters.zeroPad && menits.toString().length < 2 ? '0' : '') + menits;
                    fullCountDown.menits.word.textContent = menitWord;

                    fullCountDown.detik.amount.textContent = (parameters.zeroPad && detik.toString().length < 2 ? '0' : '') + detik;
                    fullCountDown.detik.word.textContent = secondWord;
                }
            };

            // Refresh immediately to prevent a Flash of Unstyled Content
            refresh();
            interval = window.setInterval(refresh, parameters.refresh);
        });
    };

    exports.simplyCountdown = simplyCountdown;
}(window));

/*global $, jQuery, simplyCountdown*/
if (window.jQuery) {
    (function ($, simplyCountdown) {
        'use strict';

        function simplyCountdownify(el, options) {
            simplyCountdown(el, options);
        }

        $.fn.simplyCountdown = function (options) {
            return simplyCountdownify(this.selector, options);
        };
    }(jQuery, simplyCountdown));
}

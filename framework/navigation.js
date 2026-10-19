$(document).ready(function () {

  $(".m-1477c").click(function (e) {
    $('.header').toggleClass('m-e2b68');
    $('#key').focus();
    e.stopPropagation();
  })
  $(document).click(function () {
    $('.header').removeClass('m-e2b68');
  })
  $(".search").click(function (e) {
    e.stopPropagation();
  })



  // privacy
  $('.m-a25b2 .m-806eb,.m-a25b2 .m-35f99').click(function () {

    var Days = 3650;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = "name=test" + ";expires=" + exp.toGMTString() + ";path=/";
    $('.m-a25b2').addClass('m-1df23');
  })


  $(".m-a7e6d").click(function (e) {
    $(".nav").slideToggle();
    e.stopPropagation();
  });

  $(".nav ul li.has-sub > a").attr({
    "aria-haspopup": "true",
    "aria-expanded": "false"
  }).click(function (e) {
    if ($(window).width() <= 1100) {
      e.preventDefault();
      e.stopPropagation();

      var $parent = $(this).parent();
      $parent.toggleClass("sub-open");
      $parent.siblings(".has-sub").removeClass("sub-open");
      $parent.siblings(".has-sub").children("a").attr("aria-expanded", "false");
      $(this).attr("aria-expanded", $parent.hasClass("sub-open"));
    }
  });


  $(".m-d9181").click(function () {
    $("body,html").animate({
      "scrollTop": 0
    }, 500);
  });
  $(window).on("scroll resize", function () {
    var _top = $(window).scrollTop();
    var viewportWidth = $(window).width();

    if (_top < 400) {
      $(".m-d9181").stop(true).fadeOut(500);
      if (viewportWidth <= 768) {
        $(".m-60a69").stop(true).fadeOut(500);
      }
    } else {
      $(".m-d9181").stop(true).fadeIn(500);
      if (viewportWidth <= 768) {
        $(".m-60a69").stop(true).fadeIn(500);
      }
    }
  }).trigger("scroll");

  $(".TAB_CLICK li").click(function () {

    $(".TAB_CLICK li").removeClass('on');
    $(this).addClass('on');
    $('.table-box').hide();
    $('.table-box').eq($(this).index()).show();

  });
  $('#m-c0fb4').keypress(function (event) {
    if (event.which === 13) {
      event.preventDefault();
      $('#m-12e3c').submit();
    }
  });

  $('#key').keypress(function (event) {
    if (event.which === 13) {
      event.preventDefault();
      $('#m-4c1ae').submit();
    }
  });




  if ($(document).width() >= 1200) {
    var product_v = $('.nav>ul>li').attr('data-value');
    var justLoaded = true;

    function setHoverStyles(show) {
      $('.m-55bf0').css('background', show ? '#ffffff' : 'linear-gradient(to bottom,#001b34 0%,rgba(250,250,250,0))');
      $('.logo>img').each(function(){if(!this.dataset.cmsOverride)this.src='/brand/metline-logo.png';});
      $('.m-1477c>img').each(function(){if(!this.dataset.cmsOverride)this.src='/demo/icons/search-white.svg';});
      $('.header .nav>ul>li>a').css('color', show ? '#001b34' : '#ffffff');
      if (!show && product_v != 1) {
        if ($('.header').hasClass('m-dbb02')) {
            $('.header').css('background-color', 'transparent');
        } else {
            $('.header').css('background-color', '#001b34');
        }
      }
    }

    function handleHover(hoverElementId, menuItemId) {
      $(menuItemId).hover(
        function () {
          justLoaded = false;
          $(hoverElementId).find('.m-ae851>a').removeClass('m-d5b36');
          $(hoverElementId).find('.m-fc733').closest('.m-ae851').children('a').addClass('m-d5b36');
          $(hoverElementId).show();
          setHoverStyles(true);
          $(this).children('a').css('color', '#1460aa');
          $('.m-d5b36').css({ 'color': '#112a42', 'font-weight': 'bold' });
          $('.m-ae851>ul').hide();
          $('.m-fc733').show();
          if (product_v != 1) {
            $('.header').css('background-color', '#ffffff');
          }
        },
        function () {
          $(hoverElementId).hide();
          setHoverStyles(false);
        }
      );
    }

    // Apply hover effect to menu items
    handleHover('#m-8a881', '#m-aad90');
    handleHover('#m-86b38', '#m-b0b91');
    handleHover('#m-55c46', '#m-13a57');
    handleHover('#m-362c2', '#m-6db2e');

    // Handle hover for panel elements
    $('.m-bb6cb').hover(
      function () {
        $(this).show();

        $('.m-55bf0').css('background', '#ffffff');
        $('.logo>img').each(function(){if(!this.dataset.cmsOverride)this.src='/demo/logo-blue.svg';});
        $('.m-1477c>img').each(function(){if(!this.dataset.cmsOverride)this.src='/demo/icons/search-white.svg';});
        var customValue = $(this).data("value");
        $('#' + customValue).children('a').css('color', '#1460aa');
        if (product_v == 1) {
          $('.header .nav>ul>li>a').css('color', '#001b34');
        } else {
          $('.header').css('background-color', '#ffffff');
          $('.header .nav>ul>li>a').css('color', '#001b34');
        }


      },
      function () {
        $(this).hide();

        $('.header .nav>ul>li>a').css('color', '#ffffff');
        $('.logo>img').each(function(){if(!this.dataset.cmsOverride)this.src='/demo/logo-white.svg';});
        $('.m-1477c>img').each(function(){if(!this.dataset.cmsOverride)this.src='/demo/icons/search-white.svg';});
        $('.m-ae851').children('a').css('color', '#808080');
        $('.m-ae851').children('a').css('font-weight', 'normal');
        $('.m-ae851').children('span').css('color', '#808080');
        $('.m-ae851').children('span').css('font-weight', 'normal');
        var customValue = $(this).data("value");
        $('#' + customValue).children('a').css('color', '#ffffff');
        if (product_v == 1) {

          $('.m-55bf0').css('background', 'linear-gradient(to bottom,#001b34 0%,rgba(250,250,250,0))');
        } else {
            if ($('.header').hasClass('m-dbb02')) {
                $('.header').css('background-color', 'transparent');
            } else {
                $('.header').css('background-color', '#001b34');
            }
        }

      }
    );
    $('.m-ae851').hover(
      function () {
        $(this).siblings('.m-ae851').children('a').removeClass('m-d5b36');
        $(this).children('a').addClass('m-d5b36');
        $('.m-ae851>ul').css('display', 'none');
        $(this).children('ul').css('display', 'block');
        $(this).siblings('.m-ae851').children('a').css('color', '#808080');
        $(this).siblings('.m-ae851').children('a').css('font-weight', 'normal');
        $(this).siblings('.m-ae851').children('span').css('color', '#808080');
        $(this).siblings('.m-ae851').children('span').css('font-weight', 'normal');
        $(this).children('a').css('color', '#112a42');
        $(this).children('a').css('font-weight', 'bold');
        $(this).children('span').css('color', '#112a42');
        $(this).children('span').css('font-weight', 'bold');
      }
    );

    function updateKnowledgeFeatured($column) {
      var $materials = $column.children('ul').children('.m-8d20a');
      var $cards = $('#m-86b38 .m-3c994>li');

      $materials.show();
      $materials.slice(0, 4).each(function (index) {
        var $material = $(this);
        var $sourceLink = $material.children('a').first();
        var href = $.trim($sourceLink.attr('href') || '');
        var image = $.trim($material.attr('data-featured-image')||'/verified/images/coil-stock-600.webp');
        var title = $.trim($sourceLink.text());
        var $cardLinks = $cards.eq(index).children('a');
        var $imageLink = $cardLinks.eq(0);
        var $titleLink = $cardLinks.eq(1);
        var $image = $imageLink.children('img');

        if (href) {
          $imageLink.attr('href', href);
          $titleLink.attr('href', href);
        } else {
          $imageLink.removeAttr('href');
          $titleLink.removeAttr('href');
        }

        $titleLink.text(title);

        if (image) {
          $image
            .off('error.knowledgeFeatured')
            .one('error.knowledgeFeatured', function () {
              $(this).removeAttr('src').attr('alt', '').hide();
            })
            .attr({
              'src': image,
              'alt': title
            })
            .show();
        } else {
          $image
            .off('error.knowledgeFeatured')
            .removeAttr('src')
            .attr('alt', '')
            .hide();
        }
      });

      $materials.slice(0, 4).hide();
    }

    $('#m-b0b91').on('mouseenter', function () {
      updateKnowledgeFeatured($('#m-86b38 .m-fc733').closest('.m-ae851'));
    });

    $('#m-86b38 .m-ae851').on('mouseenter', function () {
      updateKnowledgeFeatured($(this));
    });

    // Reset justLoaded on mouse move
    $(document).on('mousemove', function () {
      justLoaded = false;
    });

    // Set justLoaded to true when clicking on a navigation item
    $('.header .nav>ul>li>a').on('click', function () {
      justLoaded = true;
    });

    // Handle back/forward navigation
    $(window).on('popstate', function () {
      justLoaded = true;
    });



  }

});

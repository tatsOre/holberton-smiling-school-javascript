$(document).ready(function () {
  // ===  Handler Functions  === //
  /**
   * Displays a loader during the Ajax request and hide/show an element
   * when the loader is on/off.
   * @param   {String}   selector  Element to hide/show
   * @param   {Boolean}  loading   True or false to show/hide the loader
   * @return                       No return
   */
  const displayLoading = (selector, loading) => {
    if (loading === true) {
      $(`#${selector}`).css('opacity', 0);
      $(`#${selector}`).wrap('<div class="loader"></div>');
    } else {
      $(`#${selector}`).css('opacity', 1);
      $(`#${selector}`).unwrap();
    }
  };

  // ===  Quotes Carousel - Homepage & Pricing Pages  === //
  /**
   * Creates the DOM content for the 'Quotes' section.
   * @param   {Array}   data      Array of objects (quotes) to display
   * @param   {String}  selector  Element into which the content is inserted
   * @return                      No return
   */
  const renderQuotes = (data, selector) => {
    const quotes = data.map((quote) => displayQuote(quote));

    $(`#${selector}`).append(quotes.join(''));
    $(`#${selector} .carousel-item:first`).addClass('active');
  };

  /**
   * Creates the elements for the 'Quotes' section carousel.
   * @param   {Object}  quote  Data object requested from the API
   * @return  {String}         Returns the string representation of a 'quote' element
   */
  const displayQuote = (quote) => {
    const { id, pic_url, name, text, title } = quote;
    return `
      <div id="quote-${id}" class="carousel-item px-md-5">
        <div class="row d-flex justify-content-center align-items-center">
          <div class="col-12 col-lg-3 col-sm-4 d-flex justify-content-sm-end justify-content-center">
            <img class="rounded-circle carousel__img"
                 src="${pic_url}"
                 alt="${name} profile photo">
          </div>
          <div class="col carousel-item__text px-lg-5 mr-5 pt-3">
            <p class="mr-lg-5">&laquo; ${text}</p>
            <p class="font-weight-bold">${name}</p>
            <p class="font-italic">${title}</p>
          </div>
        </div>
      </div>
    `;
  };

  // ===  Tutorials Carousel - Homepage  === //
  /**
   * Creates the DOM content for Popular Tutorials and Latest Videos
   * carousels based on the API response.
   * @param   {Array}   data      Array of objects (tutorial cards) to display
   * @param   {String}  selector  Element into which the content is inserted
   * @return                      No return
   */
  const renderCards = (data, selector) => {
    const tutorials = data.map((course) => `
        <div class="carousel-item one">
          <div class="col-lg-3 col-sm-6 col-12 d-flex justify-content-center">
            ${displayCourseCard(course)}
          </div>
        </div>`
    );
    $(`#${selector}`).append(tutorials.join(''));
    $(`#${selector} .carousel-item:first`).addClass('active');
    oneSlideAtTime();
  };

  /**
   * Advances Bootstrap Carousel one slide at a time.
   * @return                         No return
   */
  const oneSlideAtTime = () => {
    $('.one').each(function () {
      const minPerSlide = 4;
      let next = $(this).next();

      if (!next.length) {
        next = $(this).siblings(':first');
      }
      next.children(':first-child').clone().appendTo($(this));

      for (let i = 0; i < minPerSlide; i++) {
        next = next.next();
        if (!next.length) {
          next = $(this).siblings(':first');
        }
        next.children(':first-child').clone().appendTo($(this));
      }
    });
  };

  // ===  Dropdown Menu - Courses Page  === //
  /**
   * Fetch API for the Drop-down menu option values and redirects the response.
   * @return                         No return
   */
  const fetchDropdownOptions = () => {
    $.get('https://smileschool-api.hbtn.info/courses')
      .done((data) => {
        displayDropdown(data.topics, data.topic, 'topic');
        displayDropdown(data.sorts, data.sort, 'sort');
      })
      .fail(() => alert('error'));
  };

  /**
   * Creates the DOM content for the Drop-down menus
   * @param   {Array}   values       List of values for the dropdown menu
   * @param   {String}  defaultVal   Default Value for the dropdown menu
   * @param   {String}  selector     Element into which the content is inserted
   * @return                         No return
   */
  const displayDropdown = (values, defaultVal, selector) => {
    const content = values.map((val) => `<a class="dropdown-item" href="#">${val.replace('_', ' ')}</a>`);

    $(`.dropdown_${selector}`).append(content.join(''));
    $(`#dropdown-${selector}_btn`).val(defaultVal.replace('_', ' '));

    $('.dropdown-item').click(function () {
      const selected = $(this).text();
      $(this).parent().siblings(`#dropdown-${selector}_btn`).val(selected);
      $(this).parent().siblings(`#dropdown-${selector}_btn`).change();
    });
  };

  // ===  Tutorials Videos - Courses Page  === //
  /**
   * Creates and displays the DOM content for the Courses Results for Courses Page.
   * @param   {Array}   data      Array of objects (Courses cards) to display
   * @param   {String}  selector  Element into which the content is inserted
   * @return                      No return
   */
  const renderCourses = (data, selector) => {
    $(`#${selector}`).empty();
    $('.results-text').text('');

    if (data && data.courses.length) {
      const courses = data.courses.map((course) => `
        <div class="col col-lg-3 col-md-4 col-sm-6 col-12">
          ${displayCourseCard(course)}
        </div>`
      );
      $('.results-text').append(`<p class="col">${data.courses.length} videos</p>`);
      $(`#${selector}`).append(courses.join(''));
    } else {
      $('.results-text').append(
        `<p class="col">
          No result found for <b><em>"${ $('#keywords').val() }"</em></b>.
        </p>`);
    }
  };

  // ===  Handler Function for Tutorial Carousels & Courses Page  === //
  /**
   * Creates card elements for Popular Tutorials and Latest Videos carousels
   * and Courses page.
   * @param   {Object}  course  Data object requested from the API
   * @return  {String}          Returns the string representation of a 'card' element
   */
  const displayCourseCard = (course) => {
    return `
      <div class="card">
        <div class="d-flex align-items-center justify-content-center">
          <img
            src="${course['thumb_url']}"
            alt="Video thumbnail"
            class="card-img-top" />
          <img
            src="./images/play.png"
            alt="Play icon"
            class="position-absolute play__icon" />
        </div>
        <div class="card-body p-3">
          <h4 class="card-title font-weight-bold text-left">${course.title}</h4>
          <p class="card-text text-muted text-left">${course['sub-title']}</p>
          <div class="d-flex align-items-center">
            <div class="mr-3">
              <img
                src="${course['author_pic_url']}"
                alt="Profile thumbnail" width="30px"
                class="rounded-circle" />
            </div>
            <span class="user__name">${course.author}</span>
          </div>
          <div class="d-flex mt-2 justify-content-between">
            <div class="rating__stars">
              ${Array(course.star).fill().map(
                (star) => '<img src="./images/star_on.png" alt=" " />').join('')}
              ${Array(5 - course.star).fill().map(
                (star) => '<img src="./images/star_off.png" alt=" " />').join('')}
            </div>
            <span class="duration__video">${course.duration}</span>
          </div>
        </div>
      </div>
    `;
  };

  // ===  General  === //
  /**
   * Requests to the API and handles response data.
   * @param   {String}  endpoint      URL endpoint
   * @param   {Object}  searchFilter  Object for the query string
   * @return                          No return
   */
  const requestAPI = (endpoint, searchFilter = {}) => {
    const handleFunc = {
      'quotes': renderQuotes,
      'popular-tutorials': renderCards,
      'latest-videos': renderCards,
      'courses': renderCourses
    };

    displayLoading(selector = endpoint, true);

    $.get(`https://smileschool-api.hbtn.info/${endpoint}`, searchFilter)
      .done((data) => {
        displayLoading(selector = endpoint, false);
        handleFunc[endpoint](data, selector = endpoint);
      })
      .fail(() => alert('error'));
  };

  /**
   * API request with filters when: search value changes,
   * a new Topic is selected and/or a new Sort by is selected.
   */
  $('form').change(function () {
    const keywordVal = $('#keywords').val();
    const topicVal = $('#dropdown-topic_btn').val();
    const sortVal = $('#dropdown-sort_btn').val();

    const keyword = keywordVal ? keywordVal.toLowerCase() : '';
    const topic = topicVal ? topicVal.toLowerCase() : '';
    const sort = sortVal ? sortVal.toLowerCase().toLowerCase().replace(' ', '_') : '';
    requestAPI('courses', { q: keyword, topic: topic, sort: sort });
  });

  /**
   * Invokes the required functions based on the loaded page.
   */
  if (window.location.pathname.endsWith('homepage.html')) {
    ['quotes', 'popular-tutorials', 'latest-videos'].forEach((endpoint) => requestAPI(endpoint));
  } else if (window.location.pathname.endsWith('courses.html')) {
    fetchDropdownOptions();
    requestAPI('courses');

    /**
     * Prevents form submission and reloading the 'Courses' page.
     */
    window.addEventListener('load', function () {
      const form = document.getElementById('courses-form');
      form.addEventListener('submit', function (event) {
        event.preventDefault();
      });
    });
  } else {
    requestAPI('quotes');
  }
});

(function () {
var result = [];
var isNew = false;
var displayedNotif = false;

    $('.notify').on('click', function () {
        if ( !displayedNotif ) {
            display(result, isNew);
            isNew = false;
            displayedNotif = true;
            $('.fa-bell').removeClass('notice');
            $('.box-list').removeClass('box-hidden');
            $('.list-notifications').addClass('show');

        } else {
            displayedNotif = false;
            if (!$('.fa-bell').hasClass('notice')) {
                $('.list-notifications').removeClass('show');
                setTimeout(function () {$('.box-list').addClass('box-hidden')}, 1100);
            }
        }
    });

    $('.list-notifications').on('click', 'li.unread', function () {
        console.log($(this));
       $(this).addClass('read').removeClass('unread');
    });

     getData('data/invitations.json')
     .done(dataSuccess);

     setTimeout(function () {
        getData('data/invitations_update.json')
        .done(dataSuccess)
     }, 6000);
    


function dataSuccess(data) {
    isNew = true;
    result = $('.list-notifications li').length ? data.invites : result.concat(data.invites);
    displayedNotif = false;
    $('.fa-bell').addClass('notice');
    var number = result.length;
    $('.notify span').html(number>9 ? number : '0'+number);
}


function display(res, isNew) {
    if (res && isNew) {
        for (var i in res) {
            var name = res[i].sender_id.charAt(0).toUpperCase() + res[i].sender_id.substr(1);
            name = '<h4>' + name + '</h4> (';
            var sig_id = '<span class="sig_id">' + res[i].sig_id + ')</span><br>';
            var vector = '<span class="vector">' + res[i].vector + ':</span>';
            var invite = '<p>' + res[i].invite.replace(/\\n/g, '<br>').replace(/(https?:\/\/(www\.)?[a-z0-9]{2,}\.[a-z]{2,5})/g, '<a href="$1">$1</a>') + '</p>';
            var invite_time = '<div class="time">' + getTime(res[i].invite_time) + '</div>';
            var status = res[i].status;
            $('.list-notifications').prepend('<li class="'+status+'">' + name + sig_id + vector + invite + invite_time + '</li>');
        }

    }

}


function getTime(time) {
    var date = new Date();
    date.setTime(date.getTime() + time);
    return date.toString().substr(0, 15);
}

function getData(url) {
    return $.get(url)
     .fail(function (err) {
        alert("An error has occurred");
     });
}


})();
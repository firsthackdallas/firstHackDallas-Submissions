function IndexController() {
    var shellCtrl = this;

    shellCtrl.navigationLinks = [
        {
            name: "Dashboard",
            url: ''
        },
        {
            name: "...",
            url: ''
        }];

}

angular.module("LifeSaver").controller('indexController', IndexController);
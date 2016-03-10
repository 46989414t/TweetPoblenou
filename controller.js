/**
 * Created by 46465442z on 19/02/16.
 */

app.controller("Tweet", ["$scope", "chatMessages", "getUser", "getUserTweets",
    // Enviamos nuestr chatMessages al controller
    function($scope, chatMessages,getUser, getUserTweets) {
        //$scope.user = "Enric";

        $scope.setUser = function() {
            $scope.userId = $scope.usuari;
            //$scope.usuari = $scope.usuari;
            var dades = getUser($scope.userId);
            $scope.userName = dades.nom;
            $scope.userDesc = dades.desc;
            $scope.userTweets = getUserTweets($scope.userId);
            $scope.followings = getFollowings($scope.userId);
            $scope.followingTweets = getFollowingTweets($scope.userId);

            console.log("tweets: "+$scope.userTweets);
        };

        // anyadimos el array de chatMessages al scope que usaremos en nuestro ng-repeat
        $scope.messages = chatMessages;

        // un metodo para crear nuevos mensajes; llamado desde ng-submit
        $scope.addMessage = function() {
            // calling $add on a synchronized array is like Array.push(),
            // except that it saves the changes to our database!
            $scope.messages.$add({
                user: $scope.user,
                text: $scope.message
            });

            // reset the message input
            $scope.message = "";
        };

        // if the messages are empty, add something for fun!
        $scope.messages.$loaded(function() {
            if ($scope.messages.length === 0) {
                $scope.messages.$add({
                    user: "Firebase Docs",
                    text: "Hello world!"
                });
            }
        });
    }
]);

app.factory("chatMessages", ["$firebaseArray",
    function($firebaseArray) {
        // create a reference to the database location where we will store our data
        var ref = new Firebase("https://ecaibtweet.firebaseio.com/tweets");

        // this uses AngularFire to create the synchronized array
        return $firebaseArray(ref);
    }
]);

app.factory("getUser", ["$firebaseObject",
    function($firebaseObject) {
        return function(usuari) {
            var ref = new Firebase("https://ecaibtweet.firebaseio.com/users");

            return {nom: $firebaseObject(ref.child(usuari).child("name")),
                desc: $firebaseObject(ref.child(usuari).child("description")),
                userTweets: $firebaseObject(ref.child(usuari).child("tweets"))};
        };
    }
]);
app.factory("getUserTweets", ["$firebaseArray",
    function($firebaseArray) {
        return function(usuari) {
            // create a reference to the database location where we will store our data
            var ref = new Firebase("https://ecaibtweet.firebaseio.com/users");
            return $firebaseArray(ref.child(usuari).child("tweets"));
        };
    }
]);
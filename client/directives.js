angular.module('annotate').directive('anAnnotatable',
  function() {
    return {
      restrict: 'A',
      scope: {
        image: '=anImage'
      },
      controller: function($scope, $attrs, $element) {

        var canvas = $element.children('.canvas');

        var image = $element.children('img');

        $scope.helpers({
          annotations: function() {
            return Annotations.find({image: $scope.image._id});
          }
        })

        image.draggable = false;

        var dragging = false;

        canvas.on('click', function(event) {
          if (event.target.className === "canvas") {

            var xPos = event.offsetX;
            var yPos = event.offsetY;

            var height = event.target.offsetHeight;
            var width = event.target.offsetWidth;

            var xPosPercent = xPos / width * 100
            var yPosPercent = yPos / height * 100

            $scope.$apply(function() {
              Annotations.insert({
                xPos: xPosPercent,
                image: $scope.image._id,
                yPos: yPosPercent,
                order: $scope.annotations.length + 1,
                comments: []
              })
            })
          }

          // and then now add more things to the annotation
        });

        // Future functionality: drag overlay boxes
        // $element.on('mousedown', function(event) {
        //   dragging = true;
        //   console.log('annotation from here')
        // });

        // $element.on('mouseup', function(event) {
        //   dragging = false;
        //   console.log('to here')
        // });
      },
      templateUrl: 'client/templates/anAnnotatable.html'
    };
  })

angular.module('annotate').directive('anAnnotation',
  function() {
    return {
      restrict: 'A',
      scope: {
        annotation: '=anAnnotation'
      },
      controller: function($scope) {
        $scope.open = false;
        $scope.annotation.width = parseInt(angular.element('.annotation-indicator').css('width'), 10)

        $scope.toggleAnnotation = function() {
          $scope.open = !$scope.open;
        };

        $scope.closeAnnotation = function() {
          $scope.open = false;
        };

        $scope.deleteAnnotation = function() {
          Annotations.remove({_id: $scope.annotation._id});
        };

        $scope.addComment = function() {
          if ($scope.newComment) {

            console.log(Meteor.user())
            if (Meteor.user()) {
              console.log(Meteor.user())
            }

            Annotations.update({_id: $scope.annotation._id},
              {
                '$push':
                  {'comments': {
                    'comment': $scope.newComment,
                    'date': new Date(),
                    'author': Meteor.user()
                  }
                }
              })
          }
          $scope.newComment = '';
        }
      },
      templateUrl: 'client/templates/anAnnotation.html'
    }
  })

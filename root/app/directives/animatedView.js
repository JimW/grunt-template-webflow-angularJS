
app.directive('animatedView', ['$route', '$anchorScroll', '$compile', '$controller', function ($route, $anchorScroll, $compile, $controller) {
   
return {
    restrict: 'ECA',
    terminal: true,
    link: function (scope, element, attr) {

        var lastScope,
            onloadExp = attr.onload || '',
            locals,
            template;

        scope.$on('$routeChangeSuccess', update);
        update();

        function update() {
            locals = $route.current && $route.current.locals;
            template = locals && locals.$template;
            if (template) {
                $(element.children());
                bindElement();
            }
        }
        
        function destroyLastScope() {
            if (lastScope) {
                lastScope.$destroy();
                lastScope = null;
            }
        }

        function bindElement() {
            element.html(template);
            destroyLastScope();

            var link = $compile(element.contents()),
                current = $route.current,
                controller;

            lastScope = current.scope = scope.$new();
            if (current.controller) {
                locals.$scope = lastScope;
                controller = $controller(current.controller, locals);
                element.children().data('$ngControllerController', controller);
            }

            link(lastScope);
            lastScope.$emit('$viewContentLoaded');
            lastScope.$eval(onloadExp);

            // $anchorScroll might listen on event...
            $anchorScroll();
        }

    }

}
}]);
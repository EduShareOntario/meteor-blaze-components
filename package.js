Package.describe({
  name: 'edushareontario:blaze-components',
  summary: "Reusable components for Blaze, with Coffeescript2 compatible dependencies!",
  version: '0.22.1',
  git: 'https://github.com/EduShareOntario/meteor-blaze-components.git'
});

// Based on meteor/packages/templating/package.js.
Package.registerBuildPlugin({
  name: "compileBlazeComponentsTemplatesBatch",
  use: [
    'caching-html-compiler@1.1.2',
    'ecmascript@0.8.2',
    'templating-tools@1.1.2',
    'spacebars-compiler@1.1.2',
    'html-tools@1.0.11'
  ],
  sources: [
    'patch-compiling.js',
    'compile-templates.js'
  ]
});

Package.onUse(function (api) {
  api.versionsFrom('METEOR@1.4.1');

  // Core dependencies.
  api.use([
    'blaze',
    'coffeescript',
    'underscore',
    'tracker',
    'reactive-var',
    'ejson',
    'spacebars',
    'jquery'
  ]);

  // If templating package is among dependencies, we want it to be loaded before
  // us to not override our augmented functions. But we cannot make a real dependency
  // because of a plugin conflict (both us and templating are registering a *.html plugin).
  api.use([
    'templating'
  ], {weak: true});

  api.imply([
    'meteor',
    'blaze',
    'spacebars'
  ]);

  api.use('isobuild:compiler-plugin@1.0.0');

  // Internal dependencies.
  api.use([
    'edushareontario:base-component@0.16.1'
  ]);

  // 3rd party dependencies.
  api.use([
    'peerlibrary:assert@0.2.5',
    'peerlibrary:reactive-field@0.5.0',
    'peerlibrary:computed-field@0.9.0',
    'peerlibrary:data-lookup@0.2.1'
  ]);

  api.export('Template');
  api.export('BlazeComponent');
  // TODO: Move to a separate package. Possibly one with debugOnly set to true.
  api.export('BlazeComponentDebug');

  api.addFiles([
    'template.coffee',
    'compatibility/templating.js',
    'compatibility/dynamic.html',
    'compatibility/dynamic.js',
    'compatibility/lookup.js',
    'compatibility/attrs.js',
    'compatibility/materializer.js',
    'lib.coffee',
    'debug.coffee'
  ]);

  api.addFiles([
    'client.coffee'
  ], 'client');

  api.addFiles([
    'server.coffee'
  ], 'server');
});

Package.onTest(function (api) {
  api.versionsFrom('METEOR@1.4.1');

  // Core dependencies.
  api.use([
    'coffeescript',
    'jquery',
    'reactive-var',
    'underscore',
    'tracker',
    'ejson',
    'random'
  ]);

  // Internal dependencies.
  api.use([
    'peerlibrary:blaze-components'
  ]);

  // 3rd party dependencies.
  api.use([
    'peerlibrary:classy-test@0.2.26',
    'mquandalle:harmony@1.3.79',
    'peerlibrary:reactive-field@0.5.0',
    'peerlibrary:assert@0.2.5'
  ]);

  api.addFiles([
    'tests/tests.html',
    'tests/tests.coffee',
    'tests/tests.js',
    'tests/tests.next.js',
    'tests/tests.css'
   ]);
});

import gulp from 'gulp';
import gulpESlint from 'gulp-eslint';
import gulpMocha from 'gulp-mocha';
import runSequence from 'run-sequence';

const SRCDIR = 'modules';
const SPECDIR = 'spec';
const defaultLoader = require.extensions['.js'];

function transpilePath(path, babelConfig) {
  /* eslint-disable global-require, no-underscore-dangle */
  return () => {
    require.extensions['.js'] = (module, filename) => {
      if (filename.indexOf(path) < 0) {
        defaultLoader(module, filename);
        return;
      }

      const { code } = require('babel-core').transformFileSync(
        filename,
        babelConfig,
      );

      module._compile(code, filename);
      return;
    };
  };
  /* eslint-enable */
}

const transpile = {
  'react-router': transpilePath(
    'node_modules/react-router/es6',
    {
      // TODO use react-router .babelrc
    }
  ),
};

gulp.task('load-require-hooks', (done) => {
  /* eslint-disable global-require */
  // Can't mock NavigationExperimental until lelandrichardson/react-native-mock#48 lands in
  // react-native-mock
  require('react-native-mock/mock');
  /* eslint-enable */

  // We are using react-router's es6 API via the provided es6 modules. This makes debugging much
  // easier compared to using their transpiled counterparts.
  transpile['react-router']();

  done();
});

gulp.task('lint', () => gulp
     .src([
       `${SRCDIR}/**/*.js`,
       `${SPECDIR}/**/*.js`,
       'gulpfile.js',
     ])
    .pipe(gulpESlint())
    .pipe(gulpESlint.format())
    .pipe(gulpESlint.failAfterError())
);

gulp.task('spec', ['load-require-hooks'], () =>
  gulp.src([
    `${SPECDIR}/**/*.spec.js`,
  ])
  .pipe(gulpMocha({
    reporter: 'spec',
    ui: 'bdd',
  })));

gulp.task('copy', () =>
  gulp.src([
    `${SRCDIR}/**/*.js`,
  ])
  .pipe(gulp.dest(
    'examples/Aviato/node_modules/react-router-native/modules',
  ))
);

gulp.task('default', done => {
  runSequence(
    'spec',
    'lint',
    done
   );
});

gulp.task('watch', () => {
  gulp.watch([
    `${SRCDIR}/**/*`,
    `${SPECDIR}/**/*`,
    'gulpfile.js',
  ], ['copy', 'default']);
});

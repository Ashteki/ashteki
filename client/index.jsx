/* eslint-env node */

import $ from 'jquery';
import 'jquery-validation';
import 'jquery-validation-unobtrusive';
import 'react-redux-toastr/src/styles/index.scss';
import 'core-js/stable';
import 'core-js/features/array/group-by';
import 'regenerator-runtime/runtime';
import './styles/index.scss';

$.validator.setDefaults({
    highlight: function (element) {
        $(element).closest('.form-group').addClass('has-error');
    },
    unhighlight: function (element) {
        $(element).closest('.form-group').removeClass('has-error');
    }
});

if (import.meta.env.PROD) {
    import('./index.prod.jsx');
} else {
    import('./index.dev.jsx');
}


import React from "react";
import {ErrorMessage, Field, Form, Formik, FormikErrors} from "formik";
import {Consent, CONSENT_TYPE_LABEL, ConsentType} from "./types";
import {postConsents} from "./api";

export default function GiveConsent() {
    const initialValues: Consent = {
        name: '',
        email: '',
        consents: [],
    };
    return <div id="give-consents">
        <Formik
            initialValues={initialValues}
            validate={values => {
                const errors: FormikErrors<Consent> = {};
                if (!values.name) {
                    errors.name = 'Required';
                }
                if (!values.email) {
                    errors.email = 'Required';
                } else if (
                    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                ) {
                    errors.email = 'Invalid email address';
                }
                if (!values.consents || values.consents.length === 0) {
                    errors.consents = 'Required at least 1';
                }
                return errors;
            }}
            onSubmit={async (values, {setSubmitting, resetForm}) => {
                setSubmitting(true);
                await postConsents(values);
                setSubmitting(false);
                resetForm({});
            }}
        >
            {({isSubmitting}) => (
                <Form>
                    <div className="fields">
                        <div>
                            <Field type="name" name="name" placeholder="Name"/>
                            <ErrorMessage name="name" component="div" className="error"/>
                        </div>
                        <div>
                            <Field type="email" name="email" placeholder="Email"/>
                            <ErrorMessage name="email" component="div" className="error"/>
                        </div>
                    </div>
                    <div className="consents-types">
                        <div>I agree to:</div>
                        <div className="checkboxes">
                            <div>
                                <label>
                                    <Field type="checkbox" name="consents" value={ConsentType.NEWSLETTER}/>
                                    {CONSENT_TYPE_LABEL[ConsentType.NEWSLETTER]}
                                </label>
                            </div>
                            <div>
                                <label>
                                    <Field type="checkbox" name="consents" value={ConsentType.TARGETED_ADS}/>
                                    {CONSENT_TYPE_LABEL[ConsentType.TARGETED_ADS]}
                                </label>
                            </div>
                            <div>
                                <label>
                                    <Field type="checkbox" name="consents" value={ConsentType.VISIT_STATS}/>
                                    {CONSENT_TYPE_LABEL[ConsentType.VISIT_STATS]}
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="submit">
                        <ErrorMessage name="consents" component="div" className="error"/>
                        <button type="submit" disabled={isSubmitting}>
                            Give consent
                        </button>
                    </div>
                </Form>
            )}
        </Formik>

    </div>;
}
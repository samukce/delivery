import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { compose } from "recompose";

import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";

const SignUpPage = () => (
  <div>
    <h1>Criar nova conta</h1>
    <SignUpForm />
  </div>
);

const INITIAL_STATE = {
  username: "",
  email: "",
  organizationName: "",
  passwordOne: "",
  passwordTwo: "",
  error: null,
};

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const { username, email, passwordOne, organizationName } = this.state;

    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then((authUser) => {
        this.props.firebase.user(authUser.user.uid).set({
          username,
          email,
        });

        return authUser;
      })
      .then((authUser) => {
        return {
          organizationRef: this.props.firebase
            .user(authUser.user.uid)
            .child("organizations")
            .push({
              name: organizationName,
            }),
          authUser,
        };
      })
      .then((organizationRefAndUser) => {
        this.props.firebase
          .organization(organizationRefAndUser.organizationRef.key)
          .child("about")
          .set({
            name: organizationName,
          });

        return this.props.firebase
          .organization(organizationRefAndUser.organizationRef.key)
          .child(`staff/${organizationRefAndUser.authUser.user.uid}`)
          .set({
            username,
            email,
          });
      })
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch((error) => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const {
      organizationName,
      username,
      email,
      passwordOne,
      passwordTwo,
      error,
    } = this.state;
    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === "" ||
      email === "" ||
      organizationName === "" ||
      username === "";

    return (
      <form onSubmit={this.onSubmit}>
        <input
          name="organizationName"
          value={organizationName}
          onChange={this.onChange}
          type="text"
          placeholder="Nome da Empresa"
        />
        <input
          name="username"
          value={username}
          onChange={this.onChange}
          type="text"
          placeholder="Nome completo"
        />
        <input
          name="email"
          value={email}
          onChange={this.onChange}
          type="text"
          placeholder="Email"
        />
        <input
          name="passwordOne"
          value={passwordOne}
          onChange={this.onChange}
          type="password"
          placeholder="Senha"
        />
        <input
          name="passwordTwo"
          value={passwordTwo}
          onChange={this.onChange}
          type="password"
          placeholder="Confirmar Senha"
        />
        <button disabled={isInvalid} type="submit">
          Inscrever
        </button>

        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

const SignUpLink = () => (
  <p>
    Ainda não possui uma conta? <Link to={ROUTES.SIGN_UP}>Inscrever-se</Link>
  </p>
);

export default SignUpPage;

const SignUpForm = compose(withRouter, withFirebase)(SignUpFormBase);

export { SignUpForm, SignUpLink };

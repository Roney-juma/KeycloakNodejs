# Node Express Keycloak RBAC

This is a **Node** + **Express** project for a [**RJ**] 

The tutorial is a simple demonstration of how you can implement Role Based Access Control (RBAC) with Keycloak authentication into your Node & Express REST API.

## Routes

| URL             | Method |                     Roles                    |
|:---------------:|:------:|:--------------------------------------------:|
| /menu-items     | GET    | any                                          |
| /menu-items/all | GET    | admin                                        |

## Local Installation Guide

1. Run `npm install` to install npm packages
2. Create your own ".env" file following ".env.example"
3. Run `npm start` to start server
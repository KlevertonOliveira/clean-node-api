import express from "express";

export function jsonParserMiddleware() {
  return express.json();
}

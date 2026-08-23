/**
 * JSX runtime shim. Vite aliases `react/jsx-runtime` here so that every text
 * node the app renders passes through the auto-translation dictionary before
 * React sees it. English is a pass-through; unknown strings are returned as-is.
 */
import { createElement, Fragment } from "react";
import { autoTranslate } from "./auto";

type Props = Record<string, unknown> | null | undefined;

const TEXT_PROPS = ["placeholder", "title", "alt", "aria-label", "aria-placeholder", "label"];

function translateProps(props: Props): Record<string, unknown> {
  if (!props) return {};
  let out = props as Record<string, unknown>;
  let cloned = false;
  const set = (key: string, value: unknown) => {
    if (!cloned) {
      out = { ...(props as Record<string, unknown>) };
      cloned = true;
    }
    out[key] = value;
  };

  const children = (props as Record<string, unknown>)["children"];
  if (typeof children === "string") {
    const next = autoTranslate(children);
    if (next !== children) set("children", next);
  } else if (Array.isArray(children)) {
    let changed = false;
    const next = children.map((child) => {
      if (typeof child === "string") {
        const t = autoTranslate(child);
        if (t !== child) {
          changed = true;
          return t;
        }
      }
      return child;
    });
    if (changed) set("children", next);
  }

  for (const name of TEXT_PROPS) {
    const value = (props as Record<string, unknown>)[name];
    if (typeof value === "string") {
      const next = autoTranslate(value);
      if (next !== value) set(name, next);
    }
  }

  return out;
}

function build(type: unknown, props: Props, key?: unknown) {
  const next = translateProps(props);
  if (key !== undefined) next["key"] = key;
  return createElement(type as never, next as never);
}

export function jsx(type: unknown, props: Props, key?: unknown) {
  return build(type, props, key);
}

export function jsxs(type: unknown, props: Props, key?: unknown) {
  return build(type, props, key);
}

export function jsxDEV(type: unknown, props: Props, key?: unknown) {
  return build(type, props, key);
}

export { Fragment };

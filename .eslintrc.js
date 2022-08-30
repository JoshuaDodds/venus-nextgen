module.exports = {
  extends: ["react-app", "react-app/jest", "plugin:prettier/recommended"],
  ignorePatterns: ["temp.js", "**/vendor/*.js", "**/*.json", "*.json"],
  rules: {
    "no-console": "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
  },
}

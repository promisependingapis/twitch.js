import { Octokit } from "https://cdn.skypack.dev/@octokit/core";
import readme from "./README.md";
Octokit.request('POST /markdown', {
    text: readme
});
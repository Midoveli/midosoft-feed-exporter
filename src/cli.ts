#!/usr/bin/env node
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { CsvFeedExporter } from "./csv.js";
import { DemoFeedSource } from "./demo-source.js";
import { DefaultFeedMapper } from "./mapper.js";
import { exportFeed } from "./pipeline.js";
import { BasicFeedValidator } from "./validator.js";
import { XmlFeedExporter } from "./xml.js";

const outputDirectory = resolve(process.cwd(), "output");
const source = new DemoFeedSource();
const mapper = new DefaultFeedMapper();
const validator = new BasicFeedValidator();
const [csv, xml] = await Promise.all([
  exportFeed(source, mapper, validator, new CsvFeedExporter()),
  exportFeed(source, mapper, validator, new XmlFeedExporter()),
]);

await mkdir(outputDirectory, { recursive: true });
await Promise.all([
  writeFile(resolve(outputDirectory, "demo-feed.csv"), csv, "utf8"),
  writeFile(resolve(outputDirectory, "demo-feed.xml"), xml, "utf8"),
]);
console.log("Created output/demo-feed.csv and output/demo-feed.xml from synthetic demo data.");

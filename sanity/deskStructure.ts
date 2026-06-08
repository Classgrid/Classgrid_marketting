import type { StructureBuilder } from "sanity/structure";
import { FeedbackAnalytics } from "./tools/feedbackAnalytics/FeedbackAnalytics";
import { WelcomeEmailTool } from "./tools/WelcomeEmailTool";

// Singleton document types - only one instance should exist.
const singletonTypes = new Set(["homePage", "circularTimeline", "homeStats", "aboutPage", "compareHubPage", "changelogSettings", "turboClassgrid", "isometricStack", "appEcosystem"]);

// Types already shown via custom items above.
const hiddenTypes = new Set([
  "clientLogo",
  "helpCategory",
  "helpArticle",
  "articleQuestion",
  "websiteFeedback",
]);

export const structure = (S: StructureBuilder) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("💬 Website Feedback")
        .id("websiteFeedbackList")
        .child(
          S.list()
            .title("Website Feedback")
            .items([
              S.listItem()
                .title("Feedback Analytics")
                .id("feedbackAnalytics")
                .icon(() => "📊")
                .child(S.component(FeedbackAnalytics).title("Analytics")),
              S.listItem()
                .title("All Feedback Entries")
                .id("allFeedback")
                .child(S.documentTypeList("websiteFeedback").title("All Feedbacks"))
            ])
        ),

      S.divider(),

      S.listItem()
        .title("Home Page")
        .id("homePageSingleton")
        .child(S.document().schemaType("homePage").documentId("homePage")),

      S.listItem()
        .title("Circular Timeline")
        .id("circularTimelineSingleton")
        .child(S.document().schemaType("circularTimeline").documentId("circularTimeline")),

      S.listItem()
        .title("About Us")
        .id("aboutUs")
        .child(
          S.list()
            .title("About Us")
            .items([
              S.listItem()
                .title("About Page Content")
                .id("aboutPageSingleton")
                .child(S.document().schemaType("aboutPage").documentId("aboutPage")),
              S.listItem()
                .title("Welcome Email Tool")
                .id("welcomeEmail")
                .icon(() => "📧")
                .child(S.component(WelcomeEmailTool).title("Send Welcome Email"))
            ])
        ),

      S.listItem()
        .title("Compare Hub Page")
        .id("compareHubPageSingleton")
        .child(S.document().schemaType("compareHubPage").documentId("compareHubPage")),

      S.listItem()
        .title("Changelog Settings")
        .id("changelogSettingsSingleton")
        .child(S.document().schemaType("changelogSettings").documentId("changelogSettings")),

      S.listItem()
        .title("Global Stats")
        .id("homeStatsSingleton")
        .child(S.document().schemaType("homeStats").documentId("homeStats")),

      S.divider(),

      S.listItem()
        .title("Turbo Comparison Section")
        .id("turboClassgridSingleton")
        .child(S.document().schemaType("turboClassgrid").documentId("turboClassgrid")),

      S.listItem()
        .title("Isometric Stack Section")
        .id("isometricStackSingleton")
        .child(S.document().schemaType("isometricStack").documentId("isometricStack")),

      S.listItem()
        .title("App Ecosystem Section")
        .id("appEcosystemSingleton")
        .child(S.document().schemaType("appEcosystem").documentId("appEcosystem")),

      S.divider(),

      S.listItem()
        .title("Institution Logos")
        .child(S.documentTypeList("clientLogo").title("Institution Logos")),

      S.divider(),

      S.listItem()
        .title("Help Center")
        .id("helpCenter")
        .child(
          S.list()
            .title("Help Center")
            .items([
              S.listItem()
                .title("Help Categories")
                .child(S.documentTypeList("helpCategory").title("Help Categories")),
              S.listItem()
                .title("Help Articles")
                .child(S.documentTypeList("helpArticle").title("Help Articles")),
              S.listItem()
                .title("Article Questions (Feedback)")
                .icon(() => "🙋")
                .child(S.documentTypeList("articleQuestion").title("Article Questions")),
            ])
        ),

      S.divider(),

      ...S.documentTypeListItems().filter(
        (listItem) =>
          !singletonTypes.has(listItem.getId() ?? "") &&
          !hiddenTypes.has(listItem.getId() ?? "")
      ),
    ]);

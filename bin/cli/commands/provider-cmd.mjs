export function registerProvider(program) {
  program
    .command("provider [subcommand]")
    .description("Manage provider connections (use 'providers' for the full interface)")
    .allowUnknownOption()
    .allowExcessArguments()
    .action(() => {
      console.log(`
  Use \`myrouter providers\` for the full provider management interface:

    myrouter providers available   — show provider catalog
    myrouter providers list        — list configured connections
    myrouter providers test <name> — test a provider connection
    myrouter providers test-all    — test all active connections
    myrouter providers validate    — validate local configuration
`);
    });
}

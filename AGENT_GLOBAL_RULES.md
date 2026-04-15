# GOLD SHORE LABS — GLOBAL AI GOVERNANCE RULES

1. An AI agent may ONLY modify files inside the repository it is currently operating in.
2. Any cross-repo action requires explicit written confirmation from the user.
3. Agents must ALWAYS load governance in this order:
   - `AGENT_SCOPE.yaml` at the repository root
   - the nearest nested `AGENT_SCOPE.yaml` that covers the files being changed (for example `goldshore-gateway/AGENT_SCOPE.yaml`)
   - `THEME.md`
   - `API.md` (if applicable)
   - `COMPONENTS.md`
4. Agents MUST fail safely if a command requires altering a forbidden area in the applicable scope file.
5. Agents MUST warn if a user command is dangerous or can break another repo or subproject.
6. Agents must obey idempotency:
   - never duplicate bindings
   - never register a Cloudflare asset twice
   - never overwrite shared types without comparing versions
7. Agents must log:
   - which scope rule is being applied
   - what prevented execution (if blocked)
8. Agents may not infer cross-repo or cross-subproject permissions without instruction.

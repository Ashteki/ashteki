Events during damage resolution are nested like the following.

Starts in DamageDealtAction.getEvent()

-- Passive prevention reduces amount and may avoid onDamageDealt 
-- Armor reduces amount
onDamageDealt
-- !ForcedInterrupt: onDamageApplied, cards like embrace
-- !Interrupt: onDamageApplied, optional cards like Barrier & Particle Shield
-- onDamageApplied
-- onDamagePreventedByArmor
-- -- onAddToken
-- -- killerEvent (new window)
-- -- -- !Interrupt: onCardDestroyed, "when this unit is destroyed" e.g. Gilder
-- -- -- onCardDestroyed
-- -- -- -- whenCardDestroyed
-- -- -- -- -- !ForcedInterrupt: onCardLeavesPlay, Overkill ability
-- -- -- -- -- onCardLeavesPlay
-- -- -- !Reaction: onCardDestroyed, "after a unit is destroyed", e.g. Chant of Revenge


note, that reaction handlers happen after all subEvents resolve (not just after the event opens)

local Entity = require("entity")
local common = require("common")
local landelver = require("landelver_api")

-- token entity prefab
local Token = setmetatable({}, { __index = Entity})
Token.__index = Token

local pos = common.pos(0, 0)
local image = {}

function Token:instantiate(id)
    local instance = Entity:new(id)
    image = landelver.load_image("resources/monster_border.png")
    setmetatable(instance, Token)
    return instance
end

function Token:draw()
    local x = pos.x
    local y = pos.y
    landelver.draw_text("im crying rn", x, y)
    image:draw(x, y)
end

function Token:destroy()
    print("Token is freeing assets")
    image:unload()
end

return Token
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LikesController(IUnitOfWork unitOfWork) : BaseApiController
    {
    [HttpPost("{targetUserId:int}")]
    public async Task<ActionResult> ToggleLike(int targetUserId)
    {
        var sourceUserId = User.GetUserId();

        if (sourceUserId == targetUserId) return BadRequest("You cannot like yourself");

        var existingLike = await unitOfWork.LikesRepository.GetUserLike(sourceUserId, targetUserId);

        if (existingLike == null)
        {
            var like = new UserLike
            {
                SourceUserId = sourceUserId,
                TargetUserId = targetUserId
            };

            unitOfWork.LikesRepository.AddLike(like);
        }
        else 
        {
            unitOfWork.LikesRepository.DeleteLike(existingLike);
        }

        if (await unitOfWork.Complete()) return Ok();

        return BadRequest("Failed to update like");
    }

    [HttpGet("list")]
    public async Task<ActionResult<IEnumerable<int>>> GetCurrentUserLikeIds()
    {
        return Ok(await unitOfWork.LikesRepository.GetCurrentUserLikeIds(User.GetUserId()));
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MemberDto>>> GetUserLikes([FromQuery]LikesParams likesParams)
    // public async Task<ActionResult<IEnumerable<MemberDto>>> GetUserLikes(string predicate)
    {
        likesParams.UserId = User.GetUserId();
        var users = await unitOfWork.LikesRepository.GetUserLikes(likesParams);
        // var users = await likesRepository.GetUserLikes(predicate, User.GetUserId());
        Response.AddPaginationHeader(users);

        return Ok(users);
    }
    }
}
